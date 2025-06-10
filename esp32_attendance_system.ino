#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <map>

// UUID'ler - mobil uygulama ile aynı olmalı
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Global değişkenler
BLEServer *pServer = nullptr;
BLEService *pService = nullptr;
BLECharacteristic *pCharacteristic = nullptr;
BLEScan *pBLEScan = nullptr;

// Algılanan öğrencileri depolamak için - String kullanıyoruz
std::map<String, String> detectedStudents;
std::map<String, unsigned long> lastSeenTime; // Son görülme zamanları
std::map<String, int> signalStrength;         // RSSI değerleri

// BLE tarayıcı callback'i - İyileştirilmiş
class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
{
    void onResult(BLEAdvertisedDevice advertisedDevice)
    {
        String deviceAddress = advertisedDevice.getAddress().toString();
        String deviceName = "";
        String studentId = "";
        int rssi = advertisedDevice.getRSSI();

        // Device name kontrolü
        if (advertisedDevice.haveName())
        {
            deviceName = advertisedDevice.getName().c_str();
        }

        // Öğrenci cihazlarını filtrele
        bool isStudentDevice = false;

        // Method 1: Device name ile kontrol
        if (deviceName.startsWith("STUDENT_"))
        {
            studentId = deviceName.substring(8); // "STUDENT_" sonrası
            isStudentDevice = true;
            Serial.printf("📱 Student device found by NAME: %s -> ID: %s, RSSI: %d\n",
                          deviceName.c_str(), studentId.c_str(), rssi);
        }
        else if (deviceName.startsWith("ATT_"))
        {
            studentId = deviceName.substring(4); // "ATT_" sonrası
            isStudentDevice = true;
            Serial.printf("📱 Student device found by ALT NAME: %s -> ID: %s, RSSI: %d\n",
                          deviceName.c_str(), studentId.c_str(), rssi);
        }

        // Method 2: Service UUID ile kontrol
        if (!isStudentDevice && advertisedDevice.haveServiceUUID())
        {
            BLEUUID serviceUUID = advertisedDevice.getServiceUUID();
            if (serviceUUID.equals(BLEUUID(SERVICE_UUID)))
            {
                studentId = "UUID_DETECTED"; // UUID ile algılanan
                isStudentDevice = true;
                Serial.printf("📡 Student device found by SERVICE UUID: %s, RSSI: %d\n",
                              deviceAddress.c_str(), rssi);
            }
        }

        // Method 3: Manufacturer data ile kontrol
        if (!isStudentDevice && advertisedDevice.haveManufacturerData())
        {
            std::string manData = advertisedDevice.getManufacturerData();
            if (manData.length() > 0)
            {
                // Manufacturer data'dan student ID çıkarmaya çalış
                String manDataStr = String(manData.c_str());
                if (manDataStr.length() > 0 && manDataStr.length() < 20)
                {
                    studentId = manDataStr;
                    isStudentDevice = true;
                    Serial.printf("📊 Student device found by MANUFACTURER DATA: %s -> ID: %s, RSSI: %d\n",
                                  deviceAddress.c_str(), studentId.c_str(), rssi);
                }
            }
        }

        // Öğrenci cihazı ise kaydet
        if (isStudentDevice && studentId.length() > 0)
        {
            // Zaman damgası ekle
            lastSeenTime[deviceAddress] = millis();
            signalStrength[deviceAddress] = rssi;

            // Daha önce kaydedilmemiş ise ekle
            if (detectedStudents.find(deviceAddress) == detectedStudents.end())
            {
                detectedStudents[deviceAddress] = studentId;
                Serial.printf("✅ YENİ ÖĞRENCİ KAYDEDILDI: MAC: %s, ID: %s, Device: %s, RSSI: %d\n",
                              deviceAddress.c_str(), studentId.c_str(), deviceName.c_str(), rssi);
            }
            else
            {
                // Mevcut öğrenciyi güncelle
                detectedStudents[deviceAddress] = studentId;
                Serial.printf("🔄 Öğrenci güncellendi: MAC: %s, ID: %s, RSSI: %d\n",
                              deviceAddress.c_str(), studentId.c_str(), rssi);
            }
        }
        else
        {
            // Debug için diğer cihazları da göster (çok spam olmasın diye sınırla)
            if (deviceName.length() > 0)
            {
                Serial.printf("🔍 Other device: %s (%s), RSSI: %d\n",
                              deviceName.c_str(), deviceAddress.c_str(), rssi);
            }
        }
    }
};

// Sunucu tarafı callback - İyileştirilmiş
class MyServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        Serial.println("🔗 Mobil cihaz bağlandı (Direct Connection)");

        // Bağlanan cihaz sayısını göster
        uint16_t connId = pServer->getConnId();
        Serial.printf("📱 Connection ID: %d\n", connId);
    }

    void onDisconnect(BLEServer *pServer)
    {
        Serial.println("📱 Mobil cihaz bağlantısı kesildi");
        // Bağlantı kesildiğinde yeniden advertisement başlat
        pServer->getAdvertising()->start();
        Serial.println("🔄 ESP32 advertising yeniden başlatıldı");
    }
};

// Karakteristik callback - İyileştirilmiş
class MyCharacteristicCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        String value = pCharacteristic->getValue().c_str();
        if (value.length() > 0)
        {
            Serial.printf("📝 Direct connection ile öğrenci kimliği alındı: %s\n", value.c_str());

            // Bu metod ile gelen veriyi de kaydet
            String timestamp = String(millis());
            detectedStudents["DIRECT_" + timestamp] = value;
            Serial.printf("💾 Direct student kaydedildi: %s\n", value.c_str());
        }
    }
};

// Eski kayıtları temizle (30 saniye görmediğimiz cihazlar)
void cleanOldRecords()
{
    unsigned long currentTime = millis();
    const unsigned long TIMEOUT = 30000; // 30 saniye

    for (auto it = lastSeenTime.begin(); it != lastSeenTime.end();)
    {
        if (currentTime - it->second > TIMEOUT)
        {
            String address = it->first;
            Serial.printf("🗑️ Eski kayıt siliniyor: %s (son görülme: %lu saniye önce)\n",
                          address.c_str(), (currentTime - it->second) / 1000);

            detectedStudents.erase(address);
            signalStrength.erase(address);
            it = lastSeenTime.erase(it);
        }
        else
        {
            ++it;
        }
    }
}

void setup()
{
    Serial.begin(115200);
    Serial.println("==============================================");
    Serial.println("🎓 ESP32 YOKLAMA SİSTEMİ v2.0 BAŞLATILIYOR...");
    Serial.println("==============================================");

    // BLE cihazını başlat
    BLEDevice::init("ESP32_ATTENDANCE");
    Serial.println("📡 BLE Device initialized: ESP32_ATTENDANCE");

    // BLE sunucusunu oluştur (Direct connection için)
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    // BLE servisini oluştur
    pService = pServer->createService(SERVICE_UUID);
    Serial.printf("🔧 Service created: %s\n", SERVICE_UUID);

    // Karakteristiği oluştur
    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ |
            BLECharacteristic::PROPERTY_WRITE);
    pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
    pCharacteristic->setValue("ESP32 Yoklama Sistemi Hazır v2.0");

    // Servisi başlat
    pService->start();
    Serial.println("✅ BLE Service started");

    // BLE advertisement'ı başlat (ESP32'nin kendisi için)
    BLEAdvertising *pAdvertising = pServer->getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06); // iPhone bağlantı optimizasyonu
    pAdvertising->setMinPreferred(0x12);
    pAdvertising->start();
    Serial.println("📢 ESP32 advertising started");

    // BLE tarayıcısını başlat (Mobil cihazları dinlemek için)
    pBLEScan = BLEDevice::getScan();
    pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
    pBLEScan->setActiveScan(true); // Aktif tarama - daha fazla veri
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99);

    Serial.println("==============================================");
    Serial.println("✅ YOKLAMA SİSTEMİ HAZIR!");
    Serial.println("📱 Mobil cihazlar taranıyor...");
    Serial.println("🔍 Desteklenen formatlar:");
    Serial.println("   - STUDENT_[ID] device names");
    Serial.println("   - ATT_[ID] device names");
    Serial.println("   - Service UUID: " + String(SERVICE_UUID));
    Serial.println("   - Manufacturer Data");
    Serial.println("==============================================");
}

void loop()
{
    // Her 5 saniyede tarama yap
    Serial.println("\n🔍 Öğrenci cihazları taranıyor...");
    BLEScanResults *foundDevices = pBLEScan->start(3, false); // 3 saniye tara

    // Algılanan cihaz sayısını göster
    int deviceCount = foundDevices->getCount();
    Serial.printf("📊 Bu taramada %d cihaz algılandı\n", deviceCount);

    // Aktif öğrencileri listele
    if (detectedStudents.size() > 0)
    {
        Serial.println("\n👥 AKTIF ÖĞRENCİLER:");
        Serial.println("=====================================");
        for (auto const &student : detectedStudents)
        {
            unsigned long lastSeen = lastSeenTime[student.first];
            int rssi = signalStrength[student.first];
            unsigned long timeDiff = (millis() - lastSeen) / 1000;

            Serial.printf("🎓 MAC: %s | ID: %s | RSSI: %d dBm | Son görülme: %lu sn önce\n",
                          student.first.c_str(), student.second.c_str(), rssi, timeDiff);
        }
        Serial.println("=====================================");
    }
    else
    {
        Serial.println("❌ Henüz hiç öğrenci algılanmadı");
    }

    // Tarama sonuçlarını temizle
    pBLEScan->clearResults();

    // Eski kayıtları temizle
    cleanOldRecords();

    // Bellek durumunu göster
    Serial.printf("💾 Free heap: %d bytes\n", ESP.getFreeHeap());

    // 2 saniye bekle
    delay(2000);
}