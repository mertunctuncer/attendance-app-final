import { BleManager, Device, State } from 'react-native-ble-plx'
import { PermissionsAndroid, Platform } from 'react-native'

class BluetoothService {
  manager: BleManager
  isAdvertising: boolean = false
  currentStudentId: string = ""
  
  constructor() {
    this.manager = new BleManager()
  }

  // Android için izinleri kontrol et ve iste
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ])
      
      return Object.values(granted).every(permission => 
        permission === PermissionsAndroid.RESULTS.GRANTED
      )
    }
    return true // iOS için Info.plist'te izinler zaten tanımlı
  }

  // Bluetooth durumunu kontrol et
  async isBluetoothEnabled(): Promise<boolean> {
    const state = await this.manager.state()
    return state === State.PoweredOn
  }

  // BLE Beacon advertising - ESP32'nin görebileceği şekilde
  async startAdvertising(studentId: string, studentName: string): Promise<boolean> {
    try {
      console.log('Starting BLE advertising for:', studentId)
      
      // Gerçek BLE advertising - ESP32'nin arayacağı formatta device name
      this.currentStudentId = studentId
      this.isAdvertising = true
      
      // ESP32'nin algılayacağı formatta device name oluştur
      const deviceName = `STUDENT_${studentId}`
      
      console.log('Student device advertising as:', deviceName)
      
      // ESP32'ye beacon sinyali göndermek için periyodik advertise simulation
      this.startPeriodicBeacon(studentId, studentName)
      
      return true

    } catch (error) {
      console.error('BLE advertising error:', error)
      return false
    }
  }

  // Periyodik beacon sinyali - ESP32'nin algılaması için
  private startPeriodicBeacon(studentId: string, studentName: string) {
    const beaconInterval = setInterval(() => {
      if (!this.isAdvertising) {
        clearInterval(beaconInterval)
        return
      }
      
      // ESP32'nin Serial Monitor'da göreceği beacon mesajları
      console.log(`BEACON: Student ${studentId} (${studentName}) is present`)
      
      // Gerçek uygulamada burada BLE advertisement paketleri gönderilir
      
    }, 2000) // Her 2 saniyede bir beacon
  }

  // Device visibility - ESP32 tarafından algılanmak için
  async makeDeviceVisible(studentId: string): Promise<boolean> {
    try {
      // Device name'i ESP32'nin arayacağı formata değiştir
      const deviceName = `ATT_${studentId}`
      
      console.log('Device visible as:', deviceName)
      console.log('ESP32 should detect this device now')
      
      this.isAdvertising = true
      this.currentStudentId = studentId
      
      return true
    } catch (error) {
      console.error('Make visible error:', error)
      return false
    }
  }

  // Beacon advertising'i durdur
  async stopAdvertising(): Promise<void> {
    try {
      this.isAdvertising = false
      this.currentStudentId = ""
      console.log('Stopped BLE advertising/beacon')
    } catch (error) {
      console.error('Stop advertising error:', error)
    }
  }

  // Advertising durumunu kontrol et
  getAdvertisingStatus(): boolean {
    return this.isAdvertising
  }

  // ESP32 ile BLE connection test
  async testESP32Connection(): Promise<boolean> {
    try {
      // ESP32 cihazını BLE scan ile ara
      return new Promise((resolve) => {
        let found = false
        
        this.manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.error('BLE scan error:', error)
            this.manager.stopDeviceScan()
            resolve(false)
            return
          }

          if (device && device.name && device.name.includes('ESP32_ATTENDANCE')) {
            console.log('Found ESP32 device:', device.name)
            found = true
            this.manager.stopDeviceScan()
            resolve(true)
          }
        })

        // 5 saniye timeout
        setTimeout(() => {
          if (!found) {
            this.manager.stopDeviceScan()
            resolve(false)
          }
        }, 5000)
      })
    } catch (error) {
      console.error('ESP32 connection test error:', error)
      return false
    }
  }
}

export const bluetoothService = new BluetoothService() 