import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { ViewStyle, View, TextStyle, Image, TouchableOpacity, ImageStyle, Modal } from "react-native"
import { Button, Icon, Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useStores } from "../models"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(props) {
  const { navigation } = props
  const [menuVisible, setMenuVisible] = useState(false)
  
  const {
    authenticationStore: { logout },
  } = useStores()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const handleMenuItemPress = (screen: string) => {
    // Navigate to the selected screen when implemented
    if (screen === "PersonalInformation") {
      navigation.navigate("PersonalInfo")
    } else if (screen === "Instructor") {
      navigation.navigate("Instructor")
    } else {
      console.log(`Navigating to ${screen}`)
    }
  }

  const handleBottomNavPress = (screen: string) => {
    // Navigate using bottom navigation
    if (screen === "Attend") {
      navigation.navigate("Attend")
    } else if (screen === "PersonalInfo") {
      navigation.navigate("PersonalInfo")
    } else if (screen === "Schedule") {
      navigation.navigate("Schedule")
    } else if (screen === "Absence") {
      navigation.navigate("Absence")
    } else {
      console.log(`Bottom nav to ${screen}`)
    }
  }
  
  const handleLogout = () => {
    setMenuVisible(false)
    logout()
  }

  return (
    <Screen style={$screenContainer} contentContainerStyle={$contentContainer} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={$header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon icon="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text text="Ali Yilmaz" style={$studentName} />
        <View style={$profileIcon}>
          <Icon icon="community" size={28} color={colors.palette.neutral800} />
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={$modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={$menuContainer}>
            <TouchableOpacity 
              style={$menuItem} 
              onPress={handleLogout}
            >
              <MaterialCommunityIcons name="logout" size={24} color="#333333" />
              <Text text="Log Out" style={$menuItemText} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Next Lesson Card */}
      <View style={$nextLessonCard}>
        <View style={$nextLessonHeader}>
          <Text text="Next Lesson" style={$nextLessonHeaderText} />
          <Text text="Engineering Faculty E404" style={$locationText} />
        </View>
        
        <View style={$nextLessonContent}>
          <View style={$nextIconContainer}>
            <MaterialCommunityIcons name="arrow-right-circle" size={28} color="#7469B6" />
          </View>
          <View style={$lessonInfoContainer}>
            <Text text="BIL 493" style={$lessonCodeText} />
          </View>
          <Text text="12:00 - 12:50" style={$timeText} />
        </View>
      </View>

      {/* Warning Card */}
      <View style={$warningCard}>
        <View style={$warningIconContainer}>
          <MaterialCommunityIcons name="alert-circle" size={32} color="#FF3B30" />
        </View>
        <View style={$warningTextContainer}>
          <Text text="You might fail your class!" style={$warningTitleText} />
          <Text text="Your attendance rate for BIL 386 is at 71%" style={$warningSubtitleText} />
        </View>
      </View>

      {/* Main Content - Card Buttons */}
      <View style={$cardsContainer}>
        <TouchableOpacity 
          style={$card} 
          onPress={() => handleMenuItemPress("PersonalInformation")}
        >
          <View style={$iconContainer}>
            <Icon icon="components" size={24} color="#7469B6" />
          </View>
          <Text text="Personal Information" style={$cardText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={$card} 
          onPress={() => handleMenuItemPress("Instructor")}
        >
          <View style={$iconContainer}>
            <Icon icon="community" size={24} color="#7469B6" />
          </View>
          <Text text="Instructor" style={$cardText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={$card} 
          onPress={() => handleMenuItemPress("SessionLog")}
        >
          <View style={$iconContainer}>
            <Icon icon="view" size={24} color="#7469B6" />
          </View>
          <Text text="Session Log" style={$cardText} />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={$bottomNavContainer}>
        <TouchableOpacity 
          style={$bottomNavItem} 
          onPress={() => handleBottomNavPress("Home")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="home" size={20} color="#FFFFFF" />
          </View>
          <Text text="Homepage" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem} 
          onPress={() => handleBottomNavPress("Absence")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color="#FFFFFF" />
          </View>
          <Text text="Absence" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem} 
          onPress={() => handleBottomNavPress("Attend")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="hand-wave" size={20} color="#FFFFFF" />
          </View>
          <Text text="Attend" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem} 
          onPress={() => handleBottomNavPress("Schedule")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="calendar" size={20} color="#FFFFFF" />
          </View>
          <Text text="Schedule" style={$bottomNavText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={$bottomNavItem} 
          onPress={() => handleBottomNavPress("PersonalInfo")}
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

const $studentName: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#FFFFFF",
}

const $profileIcon: ViewStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
}

const $modalOverlay: ViewStyle = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
}

const $menuContainer: ViewStyle = {
  position: "absolute",
  width: 180,
  top: 70,
  left: 16,
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  paddingVertical: 8,
  elevation: 5,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
}

const $menuItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 16,
}

const $menuItemText: TextStyle = {
  fontSize: 16,
  color: "#333333",
  marginLeft: 12,
}

const $cardsContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-start",
  marginTop: 20,
}

const $card: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  height: 80,
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  marginBottom: 16,
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: "#E0E0E0",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

const $iconContainer: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: "#F0EDFF",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 16,
}

const $customIconContainer: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $cardText: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  color: "#000000",
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

const $bottomNavText: TextStyle = {
  fontSize: 9,
  marginTop: 4,
  color: "#FFFFFF",
}

// Next Lesson Card styles
const $nextLessonCard: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
}

const $nextLessonHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
}

const $nextLessonHeaderText: TextStyle = {
  fontSize: 12,
  color: "#777777",
}

const $locationText: TextStyle = {
  fontSize: 12,
  color: "#777777",
}

const $nextLessonContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $nextIconContainer: ViewStyle = {
  marginRight: 12,
}

const $lessonInfoContainer: ViewStyle = {
  flex: 1,
}

const $lessonCodeText: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#000000",
}

const $timeText: TextStyle = {
  fontSize: 14,
  color: "#000000",
}

// Warning Card styles
const $warningCard: ViewStyle = {
  flexDirection: "row",
  backgroundColor: "#FFF4F4",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  alignItems: "center",
}

const $warningIconContainer: ViewStyle = {
  marginRight: 16,
}

const $warningTextContainer: ViewStyle = {
  flex: 1,
}

const $warningTitleText: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#FF3B30",
  marginBottom: 2,
}

const $warningSubtitleText: TextStyle = {
  fontSize: 14,
  color: "#777777",
} 