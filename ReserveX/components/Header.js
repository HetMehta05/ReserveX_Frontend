import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Header({ currentScreen }) {
    const navigation = useNavigation();

    const isNotificationScreen = currentScreen === "Notifications";
    const isProfileScreen = currentScreen === "Profile";

    return (
        <View style={styles.header}>
            <Text style={styles.logo}>ReserveX</Text>

            <View style={styles.headerIcons}>
                {/* Notification Icon */}
                <View style={styles.iconWrapper}>
                    {isNotificationScreen && <View style={styles.activeBubble} />}
                    <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                        <Ionicons name="notifications" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Profile Icon */}
                <View style={[styles.iconWrapper, { marginLeft: 20 }]}>
                    {isProfileScreen && <View style={styles.activeBubble} />}
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Ionicons name="person" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    logo: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center", // keep icons aligned
        height: 50, // fixed height to prevent jumping
    },
    iconWrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: 45,
        height: 45,
    },
    activeBubble: {
        position: "absolute",
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
        top: 0,
        left: 0,
    },
});