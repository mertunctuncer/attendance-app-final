import { observer } from "mobx-react-lite"
import { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text, Screen } from "@/components"
import { useStores } from "../models"
import { $styles, type ThemedStyle } from "@/theme"
import { useHeader } from "../utils/useHeader"
import { useAppTheme } from "@/utils/useAppTheme"
import { DemoTabScreenProps } from "@/navigators/DemoNavigator"

export const WelcomeScreen: FC<DemoTabScreenProps<"Welcome">> = observer(
  function WelcomeScreen(_props) {
    const { themed, theme } = useAppTheme()
    const {
      authenticationStore: { logout },
    } = useStores()

    useHeader(
      {
        rightTx: "common:logOut",
        onRightPress: logout,
      },
      [logout],
    )

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

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
