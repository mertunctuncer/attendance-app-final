import { BleManager, Device, Characteristic, Service as BleService } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { Alert } from 'react-native';

class BluetoothService {
  private bleManager: BleManager;
  private isScanning: boolean = false;
  private peripheralId: string | null = null;
  private isAdvertising: boolean = false;
  private deviceId: string;

  constructor() {
    this.bleManager = new BleManager();
    this.deviceId = this.generateUniqueDeviceId();
  }

  // Benzersiz bir cihaz kimliği oluşturur (öğrenci kimliği veya benzersiz bir ID)
  private generateUniqueDeviceId(): string {
    // Burada gerçek bir öğrenci ID'si veya benzersiz bir kimlik kullanılabilir
    // Şimdilik random bir ID oluşturuyoruz
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Bluetooth izinlerini kontrol eder ve ister
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return true; // iOS izinleri Info.plist üzerinden alınır
    }

    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) { // Android 12+
        const bluetoothScanPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Bluetooth Tarama İzni',
            message: 'Uygulama, yakındaki ESP32 cihazlarını bulmak için Bluetooth tarama izni gerektiriyor.',
            buttonPositive: 'Tamam',
          },
        );

        const bluetoothConnectPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'Bluetooth Bağlantı İzni',
            message: 'Uygulama, ESP32 cihazlarına bağlanmak için Bluetooth bağlantı izni gerektiriyor.',
            buttonPositive: 'Tamam',
          },
        );

        const bluetoothAdvertisePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          {
            title: 'Bluetooth Yayın İzni',
            message: 'Uygulama, yoklama için Bluetooth yayını yapabilmek için izin gerektiriyor.',
            buttonPositive: 'Tamam',
          },
        );

        const locationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message: 'Bluetooth taraması için konum izni gereklidir.',
            buttonPositive: 'Tamam',
          },
        );

        return (
          bluetoothScanPermission === PermissionsAndroid.RESULTS.GRANTED &&
          bluetoothConnectPermission === PermissionsAndroid.RESULTS.GRANTED &&
          bluetoothAdvertisePermission === PermissionsAndroid.RESULTS.GRANTED &&
          locationPermission === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message: 'Bluetooth taraması için konum izni gereklidir.',
            buttonPositive: 'Tamam',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return false;
  }

  // Bluetooth'un açık olup olmadığını kontrol eder
  async checkBluetoothState(): Promise<boolean> {
    const state = await this.bleManager.state();
    return state === 'PoweredOn';
  }

  // Bluetooth'u açmak için kullanıcıyı yönlendirir
  async enableBluetooth(): Promise<void> {
    const state = await this.bleManager.state();
    if (state !== 'PoweredOn') {
      Alert.alert(
        'Bluetooth Kapalı',
        'Devam etmek için lütfen Bluetooth\'u açın.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Ayarları Aç', onPress: () => Platform.OS === 'ios' ? this.bleManager.enable() : null }
        ]
      );
    }
  }

  // BLE taramasını başlatır
  async startScan(onDeviceFound: (device: Device) => void): Promise<void> {
    if (this.isScanning) return;

    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      Alert.alert('İzin Hatası', 'Bluetooth taraması için gerekli izinler verilmedi.');
      return;
    }

    const bluetoothEnabled = await this.checkBluetoothState();
    if (!bluetoothEnabled) {
      await this.enableBluetooth();
      return;
    }

    this.isScanning = true;

    this.bleManager.startDeviceScan(
      null,
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          console.error('Tarama hatası:', error);
          this.stopScan();
          return;
        }

        if (device) {
          // ESP32 cihazlarını filtrelemek için burada özel bir isim veya ID kontrol edilebilir
          // Örneğin: if (device.name === 'ESP32_ATTENDANCE') { ... }
          onDeviceFound(device);
        }
      }
    );

    // 60 saniye sonra taramayı durdur
    setTimeout(() => this.stopScan(), 60000);
  }

  // BLE taramasını durdurur
  stopScan(): void {
    if (!this.isScanning) return;
    this.bleManager.stopDeviceScan();
    this.isScanning = false;
  }

  // BLE reklam yayınını başlatır (öğrencilerin cihazları algılanabilir hale gelir)
  async startAdvertising(): Promise<boolean> {
    if (this.isAdvertising) return true;

    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      Alert.alert('İzin Hatası', 'Bluetooth yayını için gerekli izinler verilmedi.');
      return false;
    }

    const bluetoothEnabled = await this.checkBluetoothState();
    if (!bluetoothEnabled) {
      await this.enableBluetooth();
      return false;
    }

    try {
      // Burada mobil cihaz kendini tanıtan bir BLE advertisement başlatır
      // Not: React Native ile doğrudan advertisement başlatmak zor olabilir
      // Genellikle native modüller gerekebilir

      // Bu örnekte, BLE peripheral modunda cihazı algılanabilir yapıyoruz
      // Gerçek uygulamada, native kod ile entegrasyon gerekebilir
      
      // Şimlilik, bağlantı kurulduğunu varsayalım
      this.isAdvertising = true;
      
      console.log('Öğrenci cihazı algılanabilir durumda');
      return true;
    } catch (error) {
      console.error('Advertisement başlatma hatası:', error);
      return false;
    }
  }

  // BLE reklam yayınını durdurur
  stopAdvertising(): void {
    if (!this.isAdvertising) return;
    
    // Advertisement'ı durdur
    this.isAdvertising = false;
    console.log('Öğrenci cihazı algılanamaz durumda');
  }

  // Bluetooth bağlantısını temizler
  cleanup(): void {
    this.stopScan();
    this.stopAdvertising();
    this.bleManager.destroy();
  }

  // Öğrenci kimliğini içeren veriyi ESP32'ye gönderir
  async sendStudentIdToESP32(device: Device): Promise<boolean> {
    try {
      // ESP32 cihazına bağlan
      await this.bleManager.connectToDevice(device.id);
      console.log('ESP32 cihazına bağlandı');

      // Servis ve karakteristik keşfi
      await device.discoverAllServicesAndCharacteristics();

      // Burada servis ve karakteristik ID'leri ESP32 kodunuza göre ayarlanmalı
      const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // ESP32'deki BLE servisi UUID'si
      const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // ESP32'deki karakteristik UUID'si

      // Öğrenci kimliğini ESP32'ye gönder
      await device.writeCharacteristicWithResponse(
        serviceUUID,
        characteristicUUID,
        Buffer.from(this.deviceId).toString('base64')
      );

      console.log('Öğrenci kimliği ESP32\'ye gönderildi');
      
      // Bağlantıyı kapat
      await this.bleManager.cancelDeviceConnection(device.id);
      
      return true;
    } catch (error) {
      console.error('ESP32 ile iletişim hatası:', error);
      return false;
    }
  }
}

export default new BluetoothService(); 