import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text, Screen } from "@/components"
import { isRTL } from "@/i18n"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { $styles, type ThemedStyle } from "@/theme"
import { useHeader } from "../utils/useHeader"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/utils/useAppTheme"
import { DemoTabScreenProps } from "@/navigators/DemoNavigator"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<DemoTabScreenProps<"Welcome">> = observer(
  function WelcomeScreen(_props) {
    const { themed, theme } = useAppTheme()

    const { navigation } = _props
    const {
      authenticationStore: { logout },
    } = useStores()

    function goNext() {
      navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
    }

    useHeader(
      {
        rightTx: "common:logOut",
        onRightPress: logout,
      },
      [logout],
    )

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

    return (
      <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
        <View style={themed($topContainer)}>
          <Text
            testID="welcome-heading"
            style={themed($welcomeHeading)}
            tx="welcomeScreen:readyForLaunch"
            preset="heading"
          />
        </View>
      </Screen>
    )
  },
)

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
