import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { ViewStyle, View, TextStyle, TouchableOpacity, ScrollView } from "react-native"
import { Icon, Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface ScheduleScreenProps extends AppStackScreenProps<"Schedule"> {}

export const ScheduleScreen: FC<ScheduleScreenProps> = observer(function ScheduleScreen(props) {
  const { navigation } = props
  
  // Scroll state for horizontal scrolling
  const [scrollEnabled, setScrollEnabled] = useState(true)

  return (
    <Screen style={$screenContainer} contentContainerStyle={$contentContainer} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
          <Icon icon="back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text text="Schedule" style={$headerTitle} />
        <View style={{ width: 24 }} />
      </View>

      {/* Schedule Table - Vertical Scrolling */}
      <ScrollView style={$outerScrollContainer}>
        {/* Horizontal Scrolling */}
        <ScrollView horizontal={true} scrollEnabled={scrollEnabled} style={$tableContainer}>
          <View>
            {/* Table Header - Days */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="" style={$headerCellText} />
              </View>
              <View style={$dayCell}>
                <Text text="Pazartesi" style={$headerCellText} />
              </View>
              <View style={$dayCell}>
                <Text text="Salı" style={$headerCellText} />
              </View>
              <View style={$dayCell}>
                <Text text="Çarşamba" style={$headerCellText} />
              </View>
              <View style={$dayCell}>
                <Text text="Perşembe" style={$headerCellText} />
              </View>
              <View style={$dayCell}>
                <Text text="Cuma" style={$headerCellText} />
              </View>
            </View>

            {/* Time Row 08:00-08:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="08:00" style={$timeCellText} />
              </View>
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$emptyCell} />
            </View>

            {/* Time Row 09:00-09:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="09:00" style={$timeCellText} />
              </View>
              <View style={$courseCell}>
                <Text text="MAT250-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-510" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="MAT286-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-503" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="MAT250-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-511" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="BIL458-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-201" style={$roomText} />
                </View>
              </View>
            </View>

            {/* Time Row 10:00-10:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="10:00" style={$timeCellText} />
              </View>
              <View style={$courseCell}>
                <Text text="MAT250-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-510" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="MAT286-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-503" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="BIL386-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-202" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="MAT250-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-511" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="BIL458-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-201" style={$roomText} />
                </View>
              </View>
            </View>

            {/* Time Row 11:00-11:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="11:00" style={$timeCellText} />
              </View>
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="BIL386-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-202" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="BIL458-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-201" style={$roomText} />
                </View>
              </View>
            </View>

            {/* Time Row 12:00-12:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="12:00" style={$timeCellText} />
              </View>
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="BIL386-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-202" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
              <View style={$emptyCell} />
            </View>

            {/* Time Row 13:00-13:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="13:00" style={$timeCellText} />
              </View>
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="MAT286-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-503" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
            </View>

            {/* Time Row 14:00-14:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="14:00" style={$timeCellText} />
              </View>
              <View style={$emptyCell} />
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="SOS321-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="B-401" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="MAT286-2" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-503" style={$roomText} />
                </View>
              </View>
              <View style={$courseCell}>
                <Text text="BIL482-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-202" style={$roomText} />
                </View>
              </View>
            </View>

            {/* Time Row 15:00-15:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="15:00" style={$timeCellText} />
              </View>
              <View style={$courseCell}>
                <Text text="BIL386-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-203" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="SOS321-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="B-401" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="BIL482-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-202" style={$roomText} />
                </View>
              </View>
            </View>

            {/* Time Row 16:00-16:50 */}
            <View style={$tableRow}>
              <View style={$timeCell}>
                <Text text="16:00" style={$timeCellText} />
              </View>
              <View style={$courseCell}>
                <Text text="BIL386-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-203" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="SOS321-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="B-401" style={$roomText} />
                </View>
              </View>
              <View style={$emptyCell} />
              <View style={$courseCell}>
                <Text text="BIL482-1" style={$courseCellTitle} />
                <Text text="MÜHENDİSLİK BİNASI" style={$courseCellLocation} />
                <View style={$roomTag}>
                  <Text text="F-202" style={$roomText} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollView>

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
          style={[$bottomNavItem, $activeNavItem]}
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
  paddingHorizontal: 8,
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 16,
  paddingHorizontal: 8,
}

const $backButton: ViewStyle = {
  width: 24,
}

const $headerTitle: TextStyle = {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "bold",
}

const $tableContainer: ViewStyle = {
  flexGrow: 1,
}

const $tableRow: ViewStyle = {
  flexDirection: "row",
  borderBottomWidth: 1,
  borderBottomColor: "#E0E0E0",
}

const $timeCell: ViewStyle = {
  width: 100,
  padding: 8,
  justifyContent: "center",
  alignItems: "center",
  borderRightWidth: 1,
  borderRightColor: "#E0E0E0",
}

const $dayCell: ViewStyle = {
  width: 150,
  padding: 8,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F5F5F5",
  borderRightWidth: 1,
  borderRightColor: "#E0E0E0",
}

const $emptyCell: ViewStyle = {
  width: 150,
  padding: 8,
  justifyContent: "center",
  alignItems: "center",
  borderRightWidth: 1,
  borderRightColor: "#E0E0E0",
}

const $courseCell: ViewStyle = {
  width: 150,
  padding: 8,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F0EDFF",
  borderRightWidth: 1,
  borderRightColor: "#E0E0E0",
}

const $headerCellText: TextStyle = {
  fontSize: 14,
  fontWeight: "bold",
  color: "#333333",
  textAlign: "center",
}

const $timeCellText: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
  color: "#333333",
  textAlign: "center",
  flexShrink: 1,
}

const $courseCellTitle: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
  color: "#333333",
  textAlign: "center",
  marginBottom: 2,
}

const $courseCellLocation: TextStyle = {
  fontSize: 10,
  color: "#666666",
  textAlign: "center",
  marginBottom: 4,
}

const $roomTag: ViewStyle = {
  paddingHorizontal: 6,
  paddingVertical: 2,
  backgroundColor: "#7469B6",
  borderRadius: 4,
}

const $roomText: TextStyle = {
  fontSize: 10,
  color: "#FFFFFF",
  fontWeight: "bold",
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

const $outerScrollContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
} 