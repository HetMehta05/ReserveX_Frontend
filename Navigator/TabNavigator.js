import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import HomeScreen from "../Screens/HomeScreen";
import EventsScreen from "../Screens/EventsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                sceneContainerStyle: { backgroundColor: "transparent" },
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#aaa",
                tabBarLabelStyle: { fontSize: 10, paddingBottom: 10 },
                tabBarStyle: {
                    backgroundColor: "#0D0119", // Dark matching your bottom UI
                    borderTopWidth: 0,
                    height: 85,
                    position: "absolute",
                    elevation: 0,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Home") iconName = "home";
                    if (route.name === "Events") iconName = "calendar";
                    if (route.name === "Rooms") iconName = "location";
                    if (route.name === "Timetable") iconName = "grid";

                    return (
                        <View style={focused ? styles.activeIconContainer : null}>
                            <Ionicons name={iconName} size={22} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Events" component={EventsScreen} />
            <Tab.Screen name="Rooms" component={HomeScreen} />
            <Tab.Screen name="Timetable" component={HomeScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    activeIconContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.15)", // The "bubble" effect
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5, // Lifts the icon slightly
    },
});