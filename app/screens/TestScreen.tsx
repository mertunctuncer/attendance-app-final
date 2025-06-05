import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle, View, TextStyle } from "react-native"
import { Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"

interface TestScreenProps extends AppStackScreenProps<any> {}

export const TestScreen: FC<TestScreenProps> = observer(function TestScreen(props) {
  return (
    <Screen style={$screenContainer} contentContainerStyle={$contentContainer} safeAreaEdges={["top"]}>
      <Text text="Test Screen" style={$headerTitle} />
      
      <View style={$infoCard}>
        <Text text="This is a test screen" style={$infoValue} />
      </View>
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
  paddingTop: 20,
}

const $headerTitle: TextStyle = {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 20,
}

const $infoCard: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
}

const $infoValue: TextStyle = {
  fontSize: 16,
  color: "#000000",
} 