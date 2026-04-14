import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

import CommitteeHomeScreen from "../screens/committee/CommitteeHome";
import CommitteeNewsScreen from "../screens/committee/CommitteeNews";
import CommitteeEventsScreen from "../screens/committee/Committee_Events/committee_events";
import CreateEventScreen from "../screens/committee/Committee_Events/CommitteeCreateEvent";
import NotificationScreen from "../screens/student/NotificationScreen";

const Tab = createBottomTabNavigator();

export function CommitteeTabNavigator() {
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
                    backgroundColor: "#0D0119",
                    borderTopWidth: 0,
                    height: 85,
                    position: "absolute",
                    elevation: 0,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Dash") iconName = "home";
                    if (route.name === "Events") iconName = "calendar";
                    if (route.name === "News") iconName = "newspaper-outline";

                    return (
                        <View style={focused ? styles.activeIconContainer : null}>
                            <Ionicons name={iconName} size={22} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Dash" component={CommitteeHomeScreen} />
            <Tab.Screen name="Events" component={CommitteeEventsScreen} />
            <Tab.Screen name="News" component={CommitteeNewsScreen} />
        </Tab.Navigator>
    );
}

const Stack = createNativeStackNavigator();
export default function CommitteeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Tabs (main app) */}
            <Stack.Screen name="MainTabs" component={CommitteeTabNavigator} />

            {/* Hidden screen (NOT in tab bar) */}
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
            <Stack.Screen name="CommitteeNotification" component={NotificationScreen} />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    activeIconContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
});