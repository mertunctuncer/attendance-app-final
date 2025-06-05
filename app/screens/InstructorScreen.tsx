import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle, View, TextStyle, TouchableOpacity } from "react-native"
import { Icon, Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface InstructorScreenProps extends AppStackScreenProps<"Instructor"> {}

export const InstructorScreen: FC<InstructorScreenProps> = observer(function InstructorScreen(props) {
  const { navigation } = props

  return (
    <Screen style={$screenContainer} contentContainerStyle={$contentContainer} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
          <Icon icon="back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text text="Instructor" style={$headerTitle} />
        <View style={{ width: 24 }} />
      </View>

      {/* Instructor Details */}
      <View style={$detailsContainer}>
        <View style={$card}>
          <View style={$profileContainer}>
            <MaterialCommunityIcons name="account-circle" size={50} color="#7469B6" />
          </View>
          <Text text="Instructor:" style={$labelText} />
          <Text text="Prof. Dr. Nizami Gasilov" style={$valueText} />
        </View>

        <View style={$card}>
          <View style={$iconContainer}>
            <MaterialCommunityIcons name="phone" size={30} color="#7469B6" />
          </View>
          <Text text="Telefon:" style={$labelText} />
          <Text text="246 66 66 / 1220" style={$valueText} />
        </View>

        <View style={$card}>
          <View style={$iconContainer}>
            <MaterialCommunityIcons name="email-outline" size={30} color="#7469B6" />
          </View>
          <Text text="E-Posta:" style={$labelText} />
          <Text text="gasilov@baskent.edu.tr" style={$valueText} />
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={$bottomNavContainer}>
        <TouchableOpacity 
          style={$bottomNavItem}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="home" size={20} color="#FFFFFF" />
          </View>
          <Text text="Homepage" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem}
          onPress={() => navigation.navigate("Absence")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color="#FFFFFF" />
          </View>
          <Text text="Absence" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem}
          onPress={() => navigation.navigate("Attend")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="hand-wave" size={20} color="#FFFFFF" />
          </View>
          <Text text="Attend" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem}
          onPress={() => navigation.navigate("Schedule")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="calendar" size={20} color="#FFFFFF" />
          </View>
          <Text text="Schedule" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem}
          onPress={() => navigation.navigate("PersonalInfo")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="account" size={20} color="#FFFFFF" />
          </View>
          <Text text="Profile" style={$bottomNavText} />
        </TouchableOpacity>
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
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 16,
}

const $backButton: ViewStyle = {
  width: 24,
}

const $headerTitle: TextStyle = {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "bold",
}

const $detailsContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  paddingTop: 20,
}

const $card: ViewStyle = {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  alignItems: "center",
}

const $profileContainer: ViewStyle = {
  marginBottom: 10,
}

const $iconContainer: ViewStyle = {
  marginBottom: 10,
}

const $labelText: TextStyle = {
  fontSize: 14,
  color: "#666666",
}

const $valueText: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#333333",
  marginTop: 4,
}

const $bottomNavContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 70,
  backgroundColor: "#000000",
  borderTopWidth: 1,
  borderTopColor: "#333333",
  paddingHorizontal: 8,
}

const $bottomNavItem: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 5,
  height: "100%",
}

const $customIconContainer: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $bottomNavText: TextStyle = {
  fontSize: 9,
  marginTop: 4,
  color: "#FFFFFF",
} 