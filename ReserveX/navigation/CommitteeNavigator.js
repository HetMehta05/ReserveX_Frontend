import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

import CommitteeHomeScreen from "../screens/committee/CommitteeHome";
import CommitteeNewsScreen from "../screens/committee/CommitteeNews";
import CommitteeEventsScreen from "../screens/committee/Committee_Events/committee_events";
import CreateEditEventScreen from "../screens/committee/Committee_Events/CommitteeCreateEvent";
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
                    backgroundColor: "#100524", // deep purple background
                    borderTopWidth: 0,
                    height: 65,
                    paddingTop: 8,
                    paddingBottom: 8,
                    position: "absolute",
                    elevation: 10,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Dash") iconName = focused ? "home" : "home-outline";
                    if (route.name === "Events") iconName = "calendar";
                    if (route.name === "News") iconName = "document-text-outline";

                    // Active icon color
                    const finalColor = focused ? "#C2BAFF" : "rgba(255,255,255,0.4)";

                    return (
                        <View style={focused ? styles.activeIconWrap : null}>
                            <Ionicons name={iconName} size={22} color={finalColor} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Dash" component={CommitteeHomeScreen} options={{ tabBarLabel: 'home' }} />
            <Tab.Screen name="Events" component={CommitteeEventsScreen} options={{ tabBarLabel: 'events' }} />
            <Tab.Screen name="News" component={CommitteeNewsScreen} options={{ tabBarLabel: 'news' }} />
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
            <Stack.Screen name="CreateEditEvent" component={CreateEditEventScreen} />
            <Stack.Screen name="CommitteeNotification" component={NotificationScreen} />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    activeIconWrap: {
        backgroundColor: "rgba(194, 186, 255, 0.2)",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 0,
    },
});