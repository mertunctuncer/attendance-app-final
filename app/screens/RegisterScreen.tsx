import { observer } from "mobx-react-lite"
import { ComponentType, FC, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle, Alert } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen(props) {
  const { navigation } = props
  const studentIdInput = useRef<TextInput>(null)
  const passwordInput = useRef<TextInput>(null)

  const [name, setName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    authenticationStore: { validationError },
  } = useStores()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const error = isSubmitted ? validationError : ""

  function register() {
    setIsSubmitted(true)

    if (validationError) return

    // Show the success popup
    Alert.alert(
      "Success",
      "Registration completed successfully",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Login")
          },
        },
      ],
      { cancelable: false }
    )
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = function PasswordRightAccessory(
    props: TextFieldAccessoryProps,
  ) {
    return (
      <Icon
        icon={isPasswordHidden ? "view" : "hidden"}
        color={colors.palette.neutral800}
        containerStyle={props.style}
        size={20}
        onPress={() => setIsPasswordHidden(!isPasswordHidden)}
      />
    )
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Icon
        icon="back"
        color={colors.text}
        size={24}
        containerStyle={$backButton}
        onPress={() => navigation.goBack()}
      />
      
      <Text preset="heading" style={$title}>
        Create <Text preset="heading" style={$newText}>new</Text> Account
      </Text>
      
      <Text preset="subheading" style={$subtitle}>
        Already registered? Log in here.
      </Text>

      <TextField
        value={name}
        onChangeText={setName}
        containerStyle={themed($textField)}
        autoCapitalize="words"
        autoCorrect={false}
        label="NAME"
        placeholder="Ali Yilmaz"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => studentIdInput.current?.focus()}
      />

      <TextField
        ref={studentIdInput}
        value={studentId}
        onChangeText={setStudentId}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
        label="STUDENT ID"
        placeholder="220XXXXX"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => passwordInput.current?.focus()}
      />

      <TextField
        ref={passwordInput}
        value={password}
        onChangeText={setPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={isPasswordHidden}
        label="PASSWORD"
        placeholder="••••••"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={register}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        text="REGISTER"
        style={themed($registerButton)}
        preset="reversed"
        onPress={register}
      />
    </Screen>
  )
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $backButton: ViewStyle = {
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 1,
}

const $title: TextStyle = {
  textAlign: "center",
  marginTop: 40,
  marginBottom: 8,
}

const $newText: TextStyle = {
  color: "#A0A0A0",
}

const $subtitle: TextStyle = {
  textAlign: "center",
  marginBottom: 40,
  fontSize: 14,
}

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $registerButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  backgroundColor: "#1C1C1C",
}) 