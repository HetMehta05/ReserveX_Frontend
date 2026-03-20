import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/student/HomeScreen";
import EventsScreen from "../screens/student/EventScreen";
import RoomScreen from "../screens/student/RoomScreen";
import TimeTableScreen from "../screens/student/TimeTableScreen";
import AppBackground from "../layouts/AppBackgroundStudents";
import ProfileScreen from "../screens/student/ProfileScreen";
import NotificationScreen from "../screens/student/NotificationScreen";

const Tab = createBottomTabNavigator();

// Icon mapping for clarity
const icons = {
    Home: "home",
    Events: "calendar",
    Rooms: "location",
    Timetable: "grid",
};

// Shared screenOptions for all tabs
const screenOptions = ({ route }) => ({
    headerShown: false,
    sceneContainerStyle: { backgroundColor: "transparent" },
    tabBarShowLabel: true,
    tabBarActiveTintColor: "#fff",
    tabBarInactiveTintColor: "#aaa",
    tabBarLabelStyle: { fontSize: 10, paddingBottom: 10 },

    // Custom tab bar style
    tabBarStyle: {
        backgroundColor: "#0D0119",
        borderTopWidth: 0,
        height: 85,
        position: "absolute",
        elevation: 0,
        paddingBottom: Platform.OS === "ios" ? 25 : 10, // safe area fix
    },

    tabBarIcon: ({ focused, color }) => (
        <View style={focused ? styles.activeIconContainer : null}>
            <Ionicons name={icons[route.name]} size={22} color={color} />
        </View>
    ),

    lazy: true, // only mount screens when first visited
});

export default function StudentNavigator() {
    return (

        <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="Events"
                component={EventsScreen}
                options={{ unmountOnBlur: true }} // free memory on leaving heavy screens
            />
            <Tab.Screen name="Rooms" component={RoomScreen} />
            <Tab.Screen name="Timetable" component={TimeTableScreen} />
        </Tab.Navigator>

    );
}

const styles = StyleSheet.create({
    activeIconContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.15)", // bubble effect
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5, // lifts the icon slightly
    },
});