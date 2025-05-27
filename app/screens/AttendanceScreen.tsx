import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Alert, Platform } from 'react-native'
import { Button, Text, Screen } from '@/components'
import BluetoothService from '@/services/bluetooth/BluetoothService'
import { Device } from 'react-native-ble-plx'
import { useAppTheme } from '@/utils/useAppTheme'

export const AttendanceScreen = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [isAdvertising, setIsAdvertising] = useState(false)
  const [foundDevices, setFoundDevices] = useState<Device[]>([])
  
  const { themed, theme: { colors } } = useAppTheme()

  // Component unmount olduğunda cleanup yapma
  useEffect(() => {
    return () => {
      BluetoothService.cleanup()
    }
  }, [])

  // ESP32 cihazlarını taramaya başla
  const handleStartScan = async () => {
    setIsScanning(true)
    setFoundDevices([])

    try {
      await BluetoothService.startScan((device) => {
        setFoundDevices((prevDevices) => {
          // Duplicate cihazları engelle
          if (prevDevices.some((d) => d.id === device.id)) {
            return prevDevices
          }
          return [...prevDevices, device]
        })
      })
    } catch (error) {
      console.error('Tarama başlatma hatası:', error)
      Alert.alert('Hata', 'BLE taraması başlatılamadı.')
    } finally {
      setIsScanning(false)
    }
  }

  // Taramayı durdur
  const handleStopScan = () => {
    BluetoothService.stopScan()
    setIsScanning(false)
  }

  // Öğrenci cihazını algılanabilir hale getir
  const handleToggleAdvertising = async () => {
    if (isAdvertising) {
      BluetoothService.stopAdvertising()
      setIsAdvertising(false)
    } else {
      const success = await BluetoothService.startAdvertising()
      setIsAdvertising(success)
      
      if (success) {
        Alert.alert(
          'Yoklama Aktif',
          'Cihazınız yoklama için algılanabilir durumda. Lütfen uygulamayı kapatmayın ve Bluetooth\'u açık tutun.',
        )
      }
    }
  }

  // ESP32 cihazına bağlan ve öğrenci ID'sini gönder
  const handleConnectToESP32 = async (device: Device) => {
    try {
      const success = await BluetoothService.sendStudentIdToESP32(device)
      if (success) {
        Alert.alert('Bağlantı Başarılı', 'Öğrenci kimliğiniz yoklama sistemine kaydedildi.')
      } else {
        Alert.alert('Bağlantı Hatası', 'ESP32 cihazına bağlanılamadı veya veri gönderilemedi.')
      }
    } catch (error) {
      console.error('ESP32 bağlantı hatası:', error)
      Alert.alert('Bağlantı Hatası', 'ESP32 cihazına bağlanılamadı.')
    }
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={themed(styles.screenContainer)}>
      <View style={themed(styles.container)}>
        <Text preset="heading" text="Yoklama Sistemi" style={themed(styles.heading)} />
        
        <View style={themed(styles.section)}>
          <Text preset="subheading" text="Öğrenci Modu" style={themed(styles.subheading)} />
          <Text 
            preset="default" 
            text="Derste yoklamanızın alınması için cihazınızı algılanabilir yapın ve uygulama açık kalmalıdır."
            style={themed(styles.description)}
          />
          <Button
            preset="primary"
            text={isAdvertising ? "Yoklamayı Durdur" : "Yoklamaya Katıl"}
            onPress={handleToggleAdvertising}
            style={styles.button}
          />
        </View>

        {Platform.OS === 'android' && (
          <View style={themed(styles.section)}>
            <Text preset="subheading" text="Öğretmen Modu (Demo)" style={themed(styles.subheading)} />
            <Text 
              preset="default" 
              text="ESP32 cihazlarını taramak için aşağıdaki butonu kullanın."
              style={themed(styles.description)}
            />
            <Button
              preset="default"
              text={isScanning ? "Taramayı Durdur" : "ESP32 Cihazlarını Tara"}
              onPress={isScanning ? handleStopScan : handleStartScan}
              style={styles.button}
            />
            
            {foundDevices.length > 0 && (
              <View style={themed(styles.deviceList)}>
                <Text preset="bold" text="Bulunan Cihazlar:" style={themed(styles.deviceListTitle)} />
                {foundDevices.map((device) => (
                  <View key={device.id} style={themed(styles.deviceItem)}>
                    <Text 
                      preset="default" 
                      text={`${device.name || 'İsimsiz Cihaz'} (${device.id})`}
                      style={themed(styles.deviceText)}
                    />
                    <Button
                      preset="small"
                      text="Bağlan"
                      onPress={() => handleConnectToESP32(device)}
                      style={styles.connectButton}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  screenContainer: (theme) => ({
    backgroundColor: theme.colors.background,
  }),
  container: (theme) => ({
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  }),
  heading: (theme) => ({
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  }),
  section: (theme) => ({
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: theme.colors.palette.neutral100,
    borderWidth: 1,
    borderColor: theme.colors.palette.neutral200,
    shadowColor: theme.colors.palette.neutral900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }),
  subheading: (theme) => ({
    marginBottom: 12,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  }),
  description: (theme) => ({
    marginBottom: 16,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
  }),
  button: {
    marginTop: 12,
  },
  deviceList: (theme) => ({
    marginTop: 20,
    padding: 16,
    backgroundColor: theme.colors.palette.neutral50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.palette.neutral200,
  }),
  deviceListTitle: (theme) => ({
    marginBottom: 12,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  }),
  deviceItem: (theme) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.palette.neutral200,
    shadowColor: theme.colors.palette.neutral900,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  }),
  deviceText: (theme) => ({
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    marginRight: 12,
  }),
  connectButton: {
    minWidth: 80,
  },
}) 