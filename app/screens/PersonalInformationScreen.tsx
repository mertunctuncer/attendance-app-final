import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle, View, TextStyle, TouchableOpacity } from "react-native"
import { Icon, Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface PersonalInformationScreenProps extends AppStackScreenProps<"PersonalInfo"> {}

export const PersonalInformationScreen: FC<PersonalInformationScreenProps> = observer(function PersonalInformationScreen(props) {
  const { navigation } = props

  return (
    <Screen style={$screenContainer} contentContainerStyle={$contentContainer} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
          <Icon icon="back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text text="Personal Information" style={$headerTitle} />
        <View style={{ width: 24 }} />
      </View>
      
      <View style={$headerUnderline} />

      {/* Info Cards */}
      <View style={$cardsContainer}>
        {/* E-mail Card */}
        <View style={$infoCard}>
          <View style={$iconContainer}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#7469B6" />
          </View>
          <View style={$infoTextContainer}>
            <Text text="E-posta adresi:" style={$infoLabel} />
            <Text text="22367018@mail.baskent.edu.tr" style={$infoValue} />
          </View>
        </View>

        {/* Country Card */}
        <View style={$infoCard}>
          <View style={$iconContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color="#7469B6" />
          </View>
          <View style={$infoTextContainer}>
            <Text text="Ülke:" style={$infoLabel} />
            <Text text="Türkiye" style={$infoValue} />
          </View>
        </View>

        {/* City Card */}
        <View style={$infoCard}>
          <View style={$iconContainer}>
            <MaterialCommunityIcons name="city-variant-outline" size={24} color="#7469B6" />
          </View>
          <View style={$infoTextContainer}>
            <Text text="Şehir:" style={$infoLabel} />
            <Text text="Ankara" style={$infoValue} />
          </View>
        </View>

        {/* Timezone Card */}
        <View style={$infoCard}>
          <View style={$iconContainer}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={24} color="#7469B6" />
          </View>
          <View style={$infoTextContainer}>
            <Text text="Zaman Dilimi:" style={$infoLabel} />
            <Text text="Avrupa" style={$infoValue} />
          </View>
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
          style={[$bottomNavItem, $activeNavItem]}
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

const $headerUnderline: ViewStyle = {
  height: 1,
  backgroundColor: "#FFFFFF",
  marginBottom: 20,
}

const $cardsContainer: ViewStyle = {
  flex: 1,
}

const $infoCard: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  marginBottom: 16,
  padding: 16,
}

const $iconContainer: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F0EDFF",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 16,
}

const $infoTextContainer: ViewStyle = {
  flex: 1,
}

const $infoLabel: TextStyle = {
  fontSize: 14,
  color: "#666666",
  marginBottom: 4,
}

const $infoValue: TextStyle = {
  fontSize: 16,
  color: "#000000",
  fontWeight: "600",
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

const $activeNavItem: ViewStyle = {
  borderTopWidth: 2,
  borderTopColor: "#FFFFFF",
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