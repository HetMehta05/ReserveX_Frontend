import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import AppBackgroundCommittee from "../../layouts/AppBackgroundCommittee";

const NotificationScreen = () => {
    const navigation = useNavigation();

    return (
        <AppBackgroundStudents>
            <View style={styles.container}>
                {/* Header */}
                <Header currentScreen={"Notifications"} />

                {/* Title */}
                <Text style={styles.title}>Notifications</Text>

                {/* Notification List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                >
                    {Array.from({ length: 8 }).map((_, index) => (
                        <View key={index} style={styles.notificationCard} />
                    ))}
                </ScrollView>
            </View>
        </AppBackgroundStudents>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
    },

    /* Header */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },

    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },

    /* Icons */
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    activeBubble: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",

        // 🔥 add depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },

    /* Title */
    title: {
        color: "#fff",
        fontSize: 22,
        marginTop: 30,
        marginBottom: 20,
        letterSpacing: 1,
        fontWeight: "600", // 🔥 added
    },

    /* List */
    listContainer: {
        paddingBottom: 140, // 🔥 safer for tab bar
    },

    notificationCard: {
        height: 65, // 🔥 slightly taller
        borderRadius: 16,
        marginBottom: 16,

        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",

        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },

        elevation: 6,
    },
});