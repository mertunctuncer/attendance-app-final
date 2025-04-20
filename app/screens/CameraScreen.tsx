import { observer } from "mobx-react-lite"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { Text } from "@/components"
import { DemoTabScreenProps } from "@/navigators/DemoNavigator"
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera"

export const CameraScreen: FC<DemoTabScreenProps<"Camera">> = observer(
  function CameraScreen(_props) {
    const { hasPermission } = useCameraPermission()
    const device = useCameraDevice("front")
    if (!hasPermission) {
      return (
        <View>
          <Text text={"No camera permissions"}></Text>
        </View>
      )
    }
    return <Camera style={StyleSheet.absoluteFill} device={device!} isActive={true} />
  },
)