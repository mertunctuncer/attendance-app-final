import { BleManager, Device, State } from 'react-native-ble-plx'
import { PermissionsAndroid, Platform } from 'react-native'

// ESP32 ile uyumlu UUID'ler
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'

class BluetoothService {
  manager: BleManager
  isAdvertising: boolean = false
  currentStudentId: string = ""
  advertisingInterval: NodeJS.Timeout | null = null
  
  constructor() {
    this.manager = new BleManager()
  }

  // Android için tüm gerekli izinleri kontrol et ve iste
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      ])
      
      const allGranted = Object.values(granted).every(permission => 
        permission === PermissionsAndroid.RESULTS.GRANTED
      )
      
      if (!allGranted) {
        console.log('Some permissions not granted:', granted)
      }
      
      return allGranted
    }
    return true // iOS için Info.plist'te izinler zaten tanımlı
  }

  // Bluetooth durumunu kontrol et
  async isBluetoothEnabled(): Promise<boolean> {
    const state = await this.manager.state()
    console.log('Bluetooth state:', state)
    return state === State.PoweredOn
  }

  // Gerçek BLE Advertising başlat - ESP32'nin algılayacağı şekilde
  async startAdvertising(studentId: string, studentName: string): Promise<boolean> {
    try {
      console.log('🚀 Starting REAL BLE advertising for student:', studentId)
      
      // Önce mevcut advertising'i durdur
      await this.stopAdvertising()
      
      this.currentStudentId = studentId
      
      // ESP32'nin algılayacağı device name formatı
      const deviceName = `STUDENT_${studentId}`
      
      // Manufacturer Data olarak student ID'yi ekle
      const manufacturerData = Buffer.from(studentId, 'utf8')
      
      // GERÇEK BLE ADVERTISING BAŞLAT
      const success = await this.manager.startAdvertising({
        localName: deviceName,
        serviceUUIDs: [SERVICE_UUID],
        manufacturerData: manufacturerData,
        includeDeviceName: true,
        includeTxPowerLevel: true,
        connectable: true,
        timeout: 0, // Sürekli advertise et
      })
      
      if (success) {
        this.isAdvertising = true
        console.log('✅ BLE Advertising başarıyla başladı!')
        console.log('📡 Device Name:', deviceName)
        console.log('📊 Service UUID:', SERVICE_UUID)
        console.log('📱 Student ID:', studentId)
        
        // Periyodik log için interval başlat
        this.startPeriodicLog(studentId, studentName)
        
        return true
      } else {
        console.error('❌ BLE Advertising başlatılamadı')
        return false
      }

    } catch (error) {
      console.error('❌ BLE advertising error:', error)
      return false
    }
  }

  // ESP32'nin görebileceği alternatif advertising metodu
  async startAlternativeAdvertising(studentId: string): Promise<boolean> {
    try {
      console.log('🔄 Starting alternative BLE advertising for:', studentId)
      
      await this.stopAdvertising()
      
      // Daha basit advertising yapısı
      const success = await this.manager.startAdvertising({
        localName: `ATT_${studentId}`,
        serviceUUIDs: [SERVICE_UUID],
        includeDeviceName: true,
        connectable: false, // Scan-only mode
        timeout: 0,
      })
      
      if (success) {
        this.isAdvertising = true
        this.currentStudentId = studentId
        console.log('✅ Alternative advertising başladı:', `ATT_${studentId}`)
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Alternative advertising error:', error)
      return false
    }
  }

  // Periyodik log - ESP32'nin algıladığını görmek için
  private startPeriodicLog(studentId: string, studentName: string) {
    this.advertisingInterval = setInterval(() => {
      if (!this.isAdvertising) {
        if (this.advertisingInterval) {
          clearInterval(this.advertisingInterval)
          this.advertisingInterval = null
        }
        return
      }
      
      console.log(`📡 Broadcasting: Student ${studentId} (${studentName}) - ESP32 should detect this!`)
      
    }, 3000) // Her 3 saniyede bir log
  }

  // BLE Advertising'i durdur
  async stopAdvertising(): Promise<void> {
    try {
      if (this.isAdvertising) {
        await this.manager.stopAdvertising()
        console.log('🛑 BLE Advertising durduruldu')
      }
      
      this.isAdvertising = false
      this.currentStudentId = ""
      
      // Interval'ı temizle
      if (this.advertisingInterval) {
        clearInterval(this.advertisingInterval)
        this.advertisingInterval = null
      }
      
    } catch (error) {
      console.error('❌ Stop advertising error:', error)
    }
  }

  // Advertising durumunu kontrol et
  getAdvertisingStatus(): boolean {
    return this.isAdvertising
  }

  // ESP32 cihazını tara ve bul
  async scanForESP32(): Promise<Device | null> {
    try {
      console.log('🔍 ESP32 cihazı aranıyor...')
      
      return new Promise((resolve) => {
        let found = false
        
        this.manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.error('❌ BLE scan error:', error)
            this.manager.stopDeviceScan()
            resolve(null)
            return
          }

          if (device && device.name) {
            console.log('📱 Bulunan cihaz:', device.name, '- MAC:', device.id)
            
            if (device.name.includes('ESP32_ATTENDANCE') || device.name.includes('ESP32')) {
              console.log('✅ ESP32 bulundu!', device.name)
              found = true
              this.manager.stopDeviceScan()
              resolve(device)
            }
          }
        })

        // 10 saniye timeout
        setTimeout(() => {
          if (!found) {
            console.log('⏰ ESP32 arama timeout')
            this.manager.stopDeviceScan()
            resolve(null)
          }
        }, 10000)
      })
    } catch (error) {
      console.error('❌ ESP32 scan error:', error)
      return null
    }
  }

  // ESP32 ile bağlantı testi
  async testESP32Connection(): Promise<boolean> {
    try {
      const esp32Device = await this.scanForESP32()
      
      if (esp32Device) {
        console.log('✅ ESP32 connection test başarılı!')
        return true
      } else {
        console.log('❌ ESP32 bulunamadı')
        return false
      }
    } catch (error) {
      console.error('❌ ESP32 connection test error:', error)
      return false
    }
  }

  // Debugging için tüm cihazları listele
  async scanAllDevices(): Promise<void> {
    try {
      console.log('🔍 Tüm BLE cihazları taranıyor...')
      
      const foundDevices: Device[] = []
      
      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error)
          this.manager.stopDeviceScan()
          return
        }

        if (device && !foundDevices.find(d => d.id === device.id)) {
          foundDevices.push(device)
          console.log(`📱 Device: ${device.name || 'Unknown'} - MAC: ${device.id} - RSSI: ${device.rssi}`)
        }
      })

      // 15 saniye sonra durdur
      setTimeout(() => {
        this.manager.stopDeviceScan()
        console.log(`📊 Toplam ${foundDevices.length} cihaz bulundu`)
      }, 15000)
      
    } catch (error) {
      console.error('❌ Scan all devices error:', error)
    }
  }
}

export const bluetoothService = new BluetoothService() 