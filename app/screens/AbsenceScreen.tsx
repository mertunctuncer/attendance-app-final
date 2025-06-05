import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { ViewStyle, View, TextStyle, TouchableOpacity, StatusBar } from "react-native"
import { Icon, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import { useAppTheme } from "@/utils/useAppTheme"
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface AbsenceScreenProps extends AppStackScreenProps<"Absence"> {}

interface AttendanceInfo {
  courseCode: string
  attended: number
  total: number
  percentage: number
}

export const AbsenceScreen: FC<AbsenceScreenProps> = observer(function AbsenceScreen(props) {
  const { navigation } = props

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  // Sample attendance data - in a real app, this would come from an API or state management
  const [attendanceData, setAttendanceData] = useState<AttendanceInfo[]>([
    { courseCode: "BIL 493", attended: 10, total: 10, percentage: 100 },
    { courseCode: "BIL 493", attended: 8, total: 40, percentage: 20 },
    { courseCode: "BIL 386", attended: 12, total: 15, percentage: 80 },
    { courseCode: "MAT 271", attended: 5, total: 20, percentage: 25 },
    { courseCode: "FIZ 137", attended: 16, total: 20, percentage: 80 },
  ])

  // Function to determine percentage color based on the attendance rate
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "#00CC66" // Green for good attendance
    if (percentage >= 70) return "#FFA500" // Orange for warning
    return "#FF3B30" // Red for poor attendance
  }

  // Bottom navigation handler
  const handleBottomNavPress = (screen: string) => {
    // Navigate using bottom navigation
    if (screen === "Attend") {
      navigation.navigate("Attend")
    } else if (screen === "PersonalInfo") {
      navigation.navigate("PersonalInfo")
    } else if (screen === "Schedule") {
      navigation.navigate("Schedule")
    } else if (screen === "Home") {
      navigation.navigate("Home")
    } else {
      console.log(`Bottom nav to ${screen}`)
    }
  }

  return (
    <View style={$screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {/* Header */}
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon icon="back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text text="Attendance Information" style={$headerTitle} />
        <View style={{ width: 24 }} />
      </View>

      {/* Attendance Information Card */}
      <View style={$contentContainer}>
        <View style={$attendanceCard}>
          <Text text="Attendance Information" style={$cardTitle} />
          
          {/* Attendance Details */}
          <View style={$attendanceList}>
            {attendanceData.map((item, index) => (
              <View key={index} style={$attendanceItem}>
                <View style={$courseInfoContainer}>
                  <Text text={item.courseCode} style={$courseCodeText} />
                  <Text 
                    text={`${item.attended}/${item.total}`} 
                    style={$attendanceCountText} 
                  />
                </View>
                <Text 
                  text={`${item.percentage}%`} 
                  style={[
                    $percentageText, 
                    { color: getPercentageColor(item.percentage) }
                  ]} 
                />
              </View>
            ))}
          </View>
        </View>

        {/* Information Block */}
        <View style={$infoCard}>
          <Text text="Attendance Policy" style={$infoTitle} />
          <Text 
            text="You need to maintain at least 70% attendance to pass each course. Below 70% attendance may result in course failure." 
            style={$infoText} 
          />
        </View>
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
          style={[$bottomNavItem, $activeNavItem]} 
          onPress={() => handleBottomNavPress("Absence")}
        >
          <View style={$customIconContainer}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color="#7469B6" />
          </View>
          <Text text="Absence" style={[$bottomNavText, $activeNavText]} />
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
    </View>
  )
})

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#000000",
  paddingTop: 30, // Statusbar yüksekliği için
}

const $contentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: 16,
  paddingBottom: 80, // Extra space for bottom navigation
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 16,
  marginBottom: 5,
}

const $headerTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#FFFFFF",
}

const $attendanceCard: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 20,
  marginVertical: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  borderWidth: 1,
  borderColor: "#7469B6",
}

const $cardTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000000",
  borderBottomWidth: 1,
  borderBottomColor: "#EEEEEE",
  paddingBottom: 10,
  marginBottom: 10,
}

const $attendanceList: ViewStyle = {
  marginTop: 10,
}

const $attendanceItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#EEEEEE",
}

const $courseInfoContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $courseCodeText: TextStyle = {
  fontSize: 16,
  fontWeight: "500",
  color: "#000000",
  width: 70,
}

const $attendanceCountText: TextStyle = {
  fontSize: 16,
  color: "#333333",
  marginLeft: 20,
}

const $percentageText: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
}

const $infoCard: ViewStyle = {
  backgroundColor: "#F0EDFF",
  borderRadius: 12,
  padding: 20,
  marginVertical: 16,
}

const $infoTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000000",
  marginBottom: 10,
}

const $infoText: TextStyle = {
  fontSize: 14,
  lineHeight: 20,
  color: "#333333",
}

// Bottom navigation styles
const $bottomNavContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 70,
  backgroundColor: "#000000",
  borderTopWidth: 1,
  borderTopColor: "#333333",
  paddingHorizontal: 8,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
}

const $bottomNavItem: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 5,
  height: "100%",
}

const $activeNavItem: ViewStyle = {
  borderTopWidth: 2,
  borderTopColor: "#7469B6",
}

const $bottomNavText: TextStyle = {
  fontSize: 9,
  marginTop: 4,
  color: "#FFFFFF",
}

const $activeNavText: TextStyle = {
  color: "#7469B6",
}

const $customIconContainer: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
} 