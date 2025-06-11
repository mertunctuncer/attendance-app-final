import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { ViewStyle, View, TextStyle, TouchableOpacity, Alert } from "react-native"
import { Button, Icon, Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import { useAppTheme } from "@/utils/useAppTheme"
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { bluetoothService } from "../services/BluetoothService"

interface AttendScreenProps extends AppStackScreenProps<"Attend"> {}

export const AttendScreen: FC<AttendScreenProps> = observer(function AttendScreen(props) {
  const { navigation } = props
  const cameraRef = useRef<Camera>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [status, setStatus] = useState<string>("Ready to join")
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('front')

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    checkBluetoothPermissions()
    
    return () => {
      // Cleanup when leaving screen
      cleanup()
    }
  }, [])

  const cleanup = async () => {
    if (hasJoined) {
      await bluetoothService.stopAdvertising()
    }
  }

  const checkBluetoothPermissions = async () => {
    try {
      console.log('🔍 Bluetooth permissions kontrol ediliyor...')
      
      // Önce BLE advertiser'ın hazır olup olmadığını kontrol et
      const hasPermissions = await bluetoothService.requestPermissions()
      console.log('📋 Bluetooth permissions:', hasPermissions)
      
      if (!hasPermissions) {
        setStatus("❌ Bluetooth permission needed")
        Alert.alert("Permission Required", "Bluetooth permissions are required for attendance system.")
        return
      }

      console.log('🔋 Bluetooth durumu kontrol ediliyor...')
      const isEnabled = await bluetoothService.isBluetoothEnabled()
      console.log('📶 Bluetooth enabled:', isEnabled)
      
      if (!isEnabled) {
        setStatus("❌ Please enable Bluetooth")
        Alert.alert("Bluetooth Required", "Please enable Bluetooth to use attendance system.")
        return
      }

      console.log('✅ Bluetooth setup tamamlandı')
      setStatus("✅ Ready to join")
    } catch (error) {
      console.error("❌ Bluetooth setup error:", error)
      setStatus("❌ Bluetooth setup failed")
      Alert.alert("Bluetooth Error", `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleJoinAttendance = async () => {
    if (hasJoined) {
      // Already joined, open camera
      await openCamera()
      return
    }

    try {
      setIsJoining(true)
      setStatus("🚀 Starting BLE advertising...")

      // Önce bluetooth durumunu tekrar kontrol et
      const isEnabled = await bluetoothService.isBluetoothEnabled()
      if (!isEnabled) {
        setStatus("❌ Bluetooth not enabled")
        Alert.alert("Bluetooth Required", "Please enable Bluetooth first.")
        return
      }

      // Gerçek öğrenci bilgilerini kullan (normalde login'den gelir)
      const studentId = "12345"
      const studentName = "John Doe"

      console.log("🚀 Gerçek BLE advertising başlatılıyor...")
      
      // GERÇEK BLE ADVERTISING BAŞLAT
      const success = await bluetoothService.startAdvertising(studentId, studentName)
      
      if (success) {
        setHasJoined(true)
        setStatus("✅ Broadcasting Active - ESP32 detecting you!")
        console.log("✅ BLE advertising başarılı!")
        
        // Test için ESP32'yi tara
        setTimeout(async () => {
          console.log("🔍 ESP32 taranıyor...")
          try {
            const esp32Found = await bluetoothService.testESP32Connection()
            if (esp32Found) {
              setStatus("✅ ESP32 Connected & Broadcasting!")
            } else {
              setStatus("⚠️ Broadcasting (ESP32 not found)")
            }
          } catch (error) {
            console.log("ESP32 test hatası:", error)
          }
        }, 2000)
        
        // Automatically open camera after successful join
        setTimeout(async () => {
          await openCamera()
        }, 3000)
      } else {
        setStatus("❌ Failed to start advertising")
        Alert.alert("BLE Error", "BLE advertising başlatılamadı. Bluetooth ayarlarını kontrol edin.")
      }
    } catch (error) {
      console.error("❌ Join attendance error:", error)
      setStatus("❌ Join failed")
      Alert.alert("Error", "BLE advertising hatası: " + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsJoining(false)
    }
  }

  // Debug butonları için async handler'lar
  const handleScanAllDevices = async () => {
    try {
      console.log('🔍 Tüm BLE cihazları taranıyor...')
      await bluetoothService.scanAllDevices()
      Alert.alert("Scan Complete", "BLE device scan tamamlandı. Console'u kontrol edin.")
    } catch (error) {
      console.error('Scan error:', error)
      Alert.alert("Scan Error", "BLE scan hatası: " + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleTestESP32 = async () => {
    try {
      console.log('🔍 ESP32 bağlantısı test ediliyor...')
      setStatus("🔍 Testing ESP32 connection...")
      const found = await bluetoothService.testESP32Connection()
      if (found) {
        setStatus("✅ ESP32 found!")
        Alert.alert("ESP32 Found", "ESP32 cihazı başarıyla bulundu!")
      } else {
        setStatus("❌ ESP32 not found")
        Alert.alert("ESP32 Not Found", "ESP32 cihazı bulunamadı. ESP32'nin açık olduğundan emin olun.")
      }
    } catch (error) {
      console.error('ESP32 test error:', error)
      setStatus("❌ ESP32 test failed")
      Alert.alert("Test Error", "ESP32 test hatası: " + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleAlternativeAdvertising = async () => {
    try {
      console.log('🔄 Alternative advertising başlatılıyor...')
      const success = await bluetoothService.startAlternativeAdvertising("TEST123")
      if (success) {
        Alert.alert("Alternative Advertising", "Alternative advertising başlatıldı!")
        setStatus("🔄 Alternative advertising active")
      } else {
        Alert.alert("Advertising Failed", "Alternative advertising başlatılamadı.")
      }
    } catch (error) {
      console.error('Alternative advertising error:', error)
      Alert.alert("Advertising Error", "Alternative advertising hatası: " + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const openCamera = async () => {
    if (!hasPermission) {
      const granted = await requestPermission()
      if (!granted) {
        Alert.alert("Permission Required", "Camera permission is required.")
        return
      }
    }

    if (!device) {
      Alert.alert("Error", "Camera not available.")
      return
    }

    setShowCamera(true)
    setIsCameraActive(true)
  }

  const handleAttendanceComplete = async () => {
    Alert.alert(
      "Attendance Confirmed", 
      "Your attendance has been recorded!", 
      [
        { 
          text: "Done", 
          onPress: async () => {
            await cleanup()
            navigation.navigate("Home")
          }
        }
      ]
    )
  }

  const handleBackToJoin = () => {
    setShowCamera(false)
    setIsCameraActive(false)
  }

  const handleLeaveAttendance = async () => {
    try {
      await cleanup()
      setHasJoined(false)
      setStatus("Ready to join")
      setShowCamera(false)
      setIsCameraActive(false)
    } catch (error) {
      console.error("Leave error:", error)
    }
  }

  return (
    <Screen style={$screenContainer} contentContainerStyle={$contentContainer} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon icon="back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={$headerTitle}>Attend</Text>
        <View style={{ width: 24 }} />
      </View>

      {!showCamera ? (
        <View style={$mainContainer}>
          {/* Status Display */}
          <View style={$statusContainer}>
            <MaterialCommunityIcons 
              name={hasJoined ? "check-circle" : "bluetooth"} 
              size={80} 
              color={hasJoined ? "#4CAF50" : "#7469B6"} 
            />
            <Text style={$statusText}>{status}</Text>
            
            {hasJoined && (
              <View style={$joinedIndicator}>
                <MaterialCommunityIcons name="wifi" size={20} color="#4CAF50" />
                <Text style={$joinedText}>Broadcasting to ESP32</Text>
              </View>
            )}
          </View>

          {/* Debug Buttons */}
          {__DEV__ && (
            <View style={$debugContainer}>
              <Text style={$debugTitle}>Debug Functions</Text>
              <TouchableOpacity 
                style={$debugButton} 
                onPress={handleScanAllDevices}
              >
                <Text style={$debugButtonText}>Scan All BLE Devices</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={$debugButton} 
                onPress={handleTestESP32}
              >
                <Text style={$debugButtonText}>Test ESP32 Connection</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={$debugButton} 
                onPress={handleAlternativeAdvertising}
              >
                <Text style={$debugButtonText}>Alternative Advertising</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Main Action Button */}
          <View style={$buttonContainer}>
            <Button
              text={
                isJoining 
                  ? "Joining..." 
                  : hasJoined 
                    ? "Open Camera" 
                    : "Join Attendance"
              }
              style={[
                $primaryButton, 
                isJoining && $buttonDisabled,
                hasJoined && $joinedButton
              ]}
              textStyle={$primaryButtonText}
              onPress={handleJoinAttendance}
              disabled={isJoining}
            />

            {hasJoined && (
              <Button
                text="Leave Attendance"
                style={$leaveButton}
                textStyle={$leaveButtonText}
                onPress={handleLeaveAttendance}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={$cameraSection}>
          {/* Camera Frame */}
          <View style={$cameraContainer}>
            <View style={$cameraFrameContainer}>
              {/* Corner borders */}
              <View style={[$cornerBorder, $topLeft]} />
              <View style={[$cornerBorder, $topRight]} />
              <View style={[$cornerBorder, $bottomLeft]} />
              <View style={[$cornerBorder, $bottomRight]} />
              
              {/* Face Icon */}
              <View style={$faceIconContainer}>
                <MaterialCommunityIcons name="emoticon-outline" size={60} color="#FFFFFF" />
              </View>
            </View>
            
            {hasPermission && device && (
              <Camera
                ref={cameraRef}
                style={$camera}
                device={device}
                isActive={isCameraActive}
              />
            )}
          </View>

          {/* Camera Controls */}
          <View style={$buttonContainer}>
            <Button
              text="Confirm Attendance"
              style={$confirmButton}
              textStyle={$confirmButtonText}
              onPress={handleAttendanceComplete}
            />
            
            <Button
              text="Back"
              style={$backButton}
              textStyle={$backButtonText}
              onPress={handleBackToJoin}
            />
          </View>
        </View>
      )}
    </Screen>
  )
})

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#000000",
}

const $contentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: 16,
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 16,
}

const $headerTitle: TextStyle = {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "600",
}

const $mainContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
}

const $statusContainer: ViewStyle = {
  alignItems: "center",
  marginBottom: 80,
}

const $statusText: TextStyle = {
  color: "#FFFFFF",
  fontSize: 18,
  textAlign: "center",
  marginTop: 24,
  fontWeight: "500",
}

const $joinedIndicator: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 20,
  backgroundColor: "#1A4D3A",
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 25,
}

const $joinedText: TextStyle = {
  color: "#4CAF50",
  fontSize: 14,
  marginLeft: 8,
  fontWeight: "500",
}

const $buttonContainer: ViewStyle = {
  width: "100%",
  gap: 16,
}

const $primaryButton: ViewStyle = {
  backgroundColor: "#7469B6",
  paddingVertical: 20,
  borderRadius: 12,
  minHeight: 60,
}

const $joinedButton: ViewStyle = {
  backgroundColor: "#4CAF50",
}

const $primaryButtonText: TextStyle = {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "600",
  textAlign: "center",
}

const $leaveButton: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 2,
  borderColor: "#FF5252",
  paddingVertical: 16,
  borderRadius: 12,
}

const $leaveButtonText: TextStyle = {
  color: "#FF5252",
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
}

const $buttonDisabled: ViewStyle = {
  backgroundColor: "#444444",
}

const $cameraSection: ViewStyle = {
  flex: 1,
}

const $cameraContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $camera: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
}

const $cameraFrameContainer: ViewStyle = {
  width: 220,
  height: 220,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1,
}

const $cornerBorder: ViewStyle = {
  position: "absolute",
  width: 40,
  height: 40,
  borderColor: "#FFFFFF",
  borderWidth: 3,
}

const $debugContainer: ViewStyle = {
  marginTop: 20,
  padding: 16,
  backgroundColor: "#2A2A2A",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#444",
}

const $debugTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 12,
  color: "#FFFFFF",
}

const $debugButton: ViewStyle = {
  backgroundColor: "#007AFF",
  padding: 10,
  borderRadius: 6,
  marginBottom: 8,
  alignItems: "center",
}

const $debugButtonText: TextStyle = {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "500",
}

const $topLeft: ViewStyle = {
  top: 0,
  left: 0,
  borderBottomWidth: 0,
  borderRightWidth: 0,
  borderTopLeftRadius: 20,
}

const $topRight: ViewStyle = {
  top: 0,
  right: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderTopRightRadius: 20,
}

const $bottomLeft: ViewStyle = {
  bottom: 0,
  left: 0,
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomLeftRadius: 20,
}

const $bottomRight: ViewStyle = {
  bottom: 0,
  right: 0,
  borderTopWidth: 0,
  borderLeftWidth: 0,
  borderBottomRightRadius: 20,
}

const $faceIconContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $confirmButton: ViewStyle = {
  backgroundColor: "#4CAF50",
  paddingVertical: 18,
  borderRadius: 12,
  marginBottom: 12,
}

const $confirmButtonText: TextStyle = {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
}

const $backButton: ViewStyle = {
  backgroundColor: "#444444",
  paddingVertical: 14,
  borderRadius: 8,
}

const $backButtonText: TextStyle = {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "500",
  textAlign: "center",
} 