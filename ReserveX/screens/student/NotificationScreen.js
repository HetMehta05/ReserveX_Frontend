import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";

const NotificationScreen = () => {

    // ✅ Dummy Notifications
    const notifications = [
        {
            id: 1,
            title: "Room Available",
            message: "Room A101 is now free",
            time: "2 min ago",
            type: "success"
        },
        {
            id: 2,
            title: "Lecture Started",
            message: "Data Structures started in B202",
            time: "10 min ago",
            type: "info"
        },
        {
            id: 3,
            title: "Room Occupied",
            message: "C303 is now occupied",
            time: "15 min ago",
            type: "warning"
        },
        {
            id: 4,
            title: "New Schedule Update",
            message: "Timetable updated for today",
            time: "30 min ago",
            type: "info"
        },
        {
            id: 5,
            title: "Room Available",
            message: "D404 is now free",
            time: "1 hr ago",
            type: "success"
        },
        {
            id: 6,
            title: "Maintenance Alert",
            message: "E505 under maintenance",
            time: "2 hr ago",
            type: "warning"
        },
        {
            id: 7,
            title: "Room Booked",
            message: "F606 has been booked for AI Lecture",
            time: "3 hr ago",
            type: "info"
        },
        {
            id: 8,
            title: "Free Slot Detected",
            message: "G707 is free for the next 2 hours",
            time: "5 hr ago",
            type: "success"
        }
    ];

    // ✅ Icon + Color based on type
    const getIcon = (type) => {
        switch (type) {
            case "success":
                return { name: "checkmark-circle", color: "#39ff14" };
            case "warning":
                return { name: "alert-circle", color: "#ff3333" };
            default:
                return { name: "information-circle", color: "#4da6ff" };
        }
    };

    return (
        <AppBackgroundStudents>
            <View style={styles.container}>

                <Header currentScreen={"Notifications"} />

                <Text style={styles.title}>Notifications</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                >
                    {notifications.map((item) => {
                        const icon = getIcon(item.type);

                        return (
                            <View key={item.id} style={styles.notificationCard}>

                                {/* Icon */}
                                <Ionicons
                                    name={icon.name}
                                    size={22}
                                    color={icon.color}
                                    style={styles.icon}
                                />

                                {/* Content */}
                                <View style={styles.textContainer}>
                                    <Text style={styles.notificationTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.message}>
                                        {item.message}
                                    </Text>
                                </View>

                                {/* Time */}
                                <Text style={styles.time}>{item.time}</Text>

                            </View>
                        );
                    })}
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

    title: {
        color: "#fff",
        fontSize: 22,
        marginBottom: 20,
        letterSpacing: 1,
        fontWeight: "600",
    },

    listContainer: {
        paddingBottom: 140,
    },

    notificationCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 26,
        marginBottom: 16,

        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },

    icon: {
        marginRight: 12,
    },

    textContainer: {
        flex: 1,
    },

    notificationTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    message: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 2,
    },

    time: {
        color: "#888",
        fontSize: 11,
    },
});