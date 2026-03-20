import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getStudentProfile } from "../../services/api";
import { useUser } from "../../context/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { user, setUser, token, setToken } = useUser();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const data = await getStudentProfile(user);
            setProfile(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("accessToken");
            setUser(null);    // clear user context
            setToken(null);   // clear token context


        } catch (err) {
            console.log("Logout failed:", err);
            Alert.alert("Logout Failed", "Please try again");
        }
    };

    // const handleDeleteAccount = async () => {
    //     Alert.alert(
    //         "Delete Account",
    //         "Are you sure you want to delete your account? This action cannot be undone.",
    //         [
    //             { text: "Cancel", style: "cancel" },
    //             {
    //                 text: "Delete",
    //                 style: "destructive",
    //                 onPress: async () => {
    //                     try {
    //                         const token = await AsyncStorage.getItem("accessToken");
    //                         if (!token) throw new Error("User not logged in");

    //                         const response = await fetch(`https://reservex.onrender.com/api/users/${userId}`, {
    //                             method: "DELETE",
    //                             headers: {
    //                                 Authorization: `Bearer ${token}`,
    //                                 "Content-Type": "application/json",
    //                             },
    //                         });

    //                         if (!response.ok) {
    //                             const data = await response.json();
    //                             throw new Error(data.message || "Failed to delete account");
    //                         }

    //                         // Clear local storage and context
    //                         await AsyncStorage.removeItem("accessToken");
    //                         setUserId(null);

    //                         // Redirect to landing
    //                         navigation.replace("Landing");

    //                     } catch (err) {
    //                         console.log("Delete account failed:", err);
    //                         Alert.alert("Delete Failed", err.message);
    //                     }
    //                 }
    //             }
    //         ]
    //     );
    // };

    console.log("Username: ", profile?.user?.name);
    return (
        <AppBackgroundStudents >
            <View style={styles.container}>

                {/* Top Right Icons */}
                <Header currentScreen={"Profile"} />

                {/* Profile Section */}
                <View style={styles.profileRow}>
                    <View style={styles.avatar} />

                    <View>
                        <Text style={styles.name}>
                            {profile?.user?.name || "Het Mehta"}
                        </Text>

                        <Text style={styles.role}>
                            {profile?.role || "Student"}
                        </Text>
                    </View>
                </View>

                {/* Details */}
                <Text style={styles.sectionTitle}>Details</Text>

                <View style={styles.detailsCard}>
                    <DetailRow label="Branch" value={profile?.branch || "Comps"} />
                    <DetailRow label="Class" value={profile?.class || "C3"} />
                    <DetailRow label="Roll no." value={profile?.rollNo || "C139"} />
                    <DetailRow label="SAP ID" value={profile?.sapId || "60004240068"} />
                </View>

                {/* Bottom Buttons */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                        <Feather name="log-out" size={18} color="#ff4d4d" />
                        <Text style={styles.actionText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} >
                        <MaterialIcons name="delete" size={18} color="#ff4d4d" />
                        <Text style={styles.actionText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppBackgroundStudents>
    );
};

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40, // 🔥 was 60 → better spacing from status bar
    },
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

        // 🔥 depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    /* Top Right */
    topIcons: {
        position: "absolute",
        right: 20,
        top: 60,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },

    profileIcon: {
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },

    /* Profile */
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        gap: 15,
    },

    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
        backgroundColor: "rgba(255,255,255,0.08)", // 🔥 subtle fill
        justifyContent: "center",
        alignItems: "center",
    },

    name: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },

    role: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 14,
        marginTop: 2,
    },

    /* Details */
    sectionTitle: {
        color: "#fff",
        marginTop: 30,
        marginBottom: 12,
        fontSize: 14,
        opacity: 0.8,
        letterSpacing: 0.5, // 🔥 subtle premium feel
    },

    detailsCard: {
        borderRadius: 12,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },

    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12, // 🔥 more breathing space
    },

    detailLabel: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
    },

    detailValue: {
        color: "#fff",
        fontSize: 12,
    },

    /* Bottom */
    bottomSection: {
        position: "absolute",
        bottom: 100, // 🔥 lifted slightly above tab bar
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        marginBottom: 12,
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.04)",

        // 🔥 depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },

    actionText: {
        color: "#fff",
        fontSize: 14,
    },
});