#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <map>

// UUID'ler - bu değerleri mobil uygulama tarafında da kullanın
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Global değişkenler
BLEServer *pServer = nullptr;
BLEService *pService = nullptr;
BLECharacteristic *pCharacteristic = nullptr;
BLEScan *pBLEScan = nullptr;

// Algılanan öğrencileri depolamak için - String kullanıyoruz
std::map<String, String> detectedStudents;

// BLE tarayıcı callback'i
class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
{
    void onResult(BLEAdvertisedDevice advertisedDevice)
    {
        // Cihaz adı veya diğer özelliklere göre öğrenci cihazlarını filtreleyebiliriz
        Serial.printf("Cihaz bulundu: %s \n", advertisedDevice.toString().c_str());

        // Eğer bu bir öğrenci cihazı ise, MAC adresini kaydet
        String deviceAddress = advertisedDevice.getAddress().toString();

        // Daha önce kaydedilmemiş ise ekle
        if (detectedStudents.find(deviceAddress) == detectedStudents.end())
        {
            detectedStudents[deviceAddress] = "Unknown"; // Başlangıçta kimlik bilinmiyor
            Serial.printf("Yeni öğrenci cihazı eklendi: %s\n", deviceAddress.c_str());
        }
    }
};

// Sunucu tarafı callback
class MyServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        Serial.println("Cihaz bağlandı");
    }

    void onDisconnect(BLEServer *pServer)
    {
        Serial.println("Cihaz bağlantısı kesildi");
        // Bağlantı kesildiğinde yeniden advertisement başlat
        pServer->getAdvertising()->start();
    }
};

// Karakteristik callback
class MyCharacteristicCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        String value = pCharacteristic->getValue().c_str();
        if (value.length() > 0)
        {
            Serial.print("Öğrenci kimliği alındı: ");
            Serial.println(value);

            // Bağlanan cihazın MAC adresini alın
            // Not: Bu işlev doğrudan mevcut olmayabilir, cihaz bağlantısında saklamanız gerekebilir
            // Bu sadece örnek bir kavramdır
            String connectedDeviceAddress = ""; // Bağlanan cihazın adresini alın

            // Öğrenci kimliğini MAC adresi ile ilişkilendirin
            if (connectedDeviceAddress.length() > 0 && detectedStudents.find(connectedDeviceAddress) != detectedStudents.end())
            {
                detectedStudents[connectedDeviceAddress] = value;
                Serial.printf("Öğrenci kaydedildi: %s -> %s\n", connectedDeviceAddress.c_str(), value.c_str());
            }
        }
    }
};

void setup()
{
    Serial.begin(115200);
    Serial.println("ESP32 Yoklama Sistemi Başlatılıyor...");

    // BLE cihazını başlat
    BLEDevice::init("ESP32_ATTENDANCE");

    // BLE sunucusunu oluştur
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    // BLE servisini oluştur
    pService = pServer->createService(SERVICE_UUID);

    // Karakteristiği oluştur
    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ |
            BLECharacteristic::PROPERTY_WRITE);
    pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
    pCharacteristic->setValue("Yoklama Sistemi Hazır");

    // Servisi başlat
    pService->start();

    // BLE advertisement'ı başlat
    BLEAdvertising *pAdvertising = pServer->getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06); // iPhone bağlantı sorunlarına yardımcı olur
    pAdvertising->setMinPreferred(0x12);
    pAdvertising->start();

    // BLE tarayıcısını başlat
    pBLEScan = BLEDevice::getScan();
    pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
    pBLEScan->setActiveScan(true); // Daha fazla bilgi almak için aktif tarama
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99);

    Serial.println("Yoklama sistemi hazır. Öğrenci cihazları taranıyor...");
}

void loop()
{
    // Periyodik olarak öğrenci cihazlarını tara (10 saniyede bir)
    Serial.println("Öğrenci cihazları taranıyor...");
    BLEScanResults *foundDevices = pBLEScan->start(5, false); // 5 saniye tara

    // Algılanan cihazları listele
    Serial.print("Algılanan cihaz sayısı: ");
    Serial.println(foundDevices->getCount());

    // Algılanan öğrencileri listele
    Serial.println("Algılanan öğrenciler:");
    for (auto const &student : detectedStudents)
    {
        Serial.printf("MAC: %s, ID: %s\n", student.first.c_str(), student.second.c_str());
    }

    // Taramayı temizle
    pBLEScan->clearResults();

    // Kısa bekle
    delay(5000); // 5 saniye bekle
}