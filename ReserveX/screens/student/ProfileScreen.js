import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import { deleteUserAccount, getUserProfile } from "../../services/api";

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { user, setUser, token, setToken } = useUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userId = user?._id || user?.id || user;
            if (!userId) {
                setLoading(false);
                return;
            }
            const data = await getUserProfile(userId);
            setProfile(data);
        } catch (err) {
            console.log("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("accessToken");
                            setUser(null);
                            setToken(null);
                        } catch (err) {
                            console.log("Logout failed:", err);
                            Alert.alert("Logout Failed", "Please try again");
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const userId = user?._id || user?.id || user;
                            await deleteUserAccount(userId);
                            await AsyncStorage.removeItem("accessToken");
                            setUser(null);
                            setToken(null);
                        } catch (err) {
                            console.log("Delete account failed:", err);
                            Alert.alert("Delete Failed", err.message || "Please try again");
                        }
                    },
                },
            ]
        );
    };

    // Extract profile fields with fallbacks
    const student = profile?.student || {};
    const userData = profile || {};

    const userName = userData.name || "Student";
    const email = userData.email || "—";

    const rollNo = student.rollNumber || "—";
    const admissionYear = student.admissionYear || "—";

    // Since backend gives only IDs (not names)
    const className = student.classId ? "Assigned" : "—";
    const department = userData.department?.name || "—";

    // Optional placeholders
    const sapId = student.sapId || "—";
    const cgpa = student.cgpa || null;
    const semester = student.semester || null;
    const attendance = student.attendance || null;
    const attendanceChange = student.attendanceChange || null;

    return (
        <AppBackgroundStudents>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Header currentScreen="Profile" />

                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#C281FF" />
                        <Text style={styles.loadingText}>Loading profile...</Text>
                    </View>
                ) : (
                    <>
                        {/* ═══ Avatar ═══ */}
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarRing}>
                                <LinearGradient
                                    colors={["#00D4AA", "#C281FF", "#5623CD"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.avatarGradientRing}
                                >
                                    <View style={styles.avatarInner}>
                                        <Ionicons name="person" size={50} color="rgba(255,255,255,0.3)" />
                                    </View>
                                </LinearGradient>
                            </View>

                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.userEmail}>{email}</Text>
                        </View>

                        {/* ═══ Info Badges ═══ */}
                        <View style={styles.badgeSection}>
                            <View style={styles.badgeFull}>
                                <Text style={styles.badgeText}>
                                    DEPARTMENT : {department.toUpperCase()}
                                </Text>
                            </View>

                            <View style={styles.badgeRow}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        CLASS : {className}
                                    </Text>
                                </View>

                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        ROLL NO. : {rollNo}
                                    </Text>
                                </View>

                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        YEAR : {admissionYear}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ═══ CGPA Card ═══ */}
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>CGPA</Text>
                            <View style={styles.statValueRow}>
                                <Text style={styles.statBigValue}>{cgpa || "—"}</Text>
                                {semester && (
                                    <Text style={styles.statSubtext}>till Semester {semester}</Text>
                                )}
                            </View>
                        </View>

                        {/* ═══ Attendance Card ═══ */}
                        <View style={[styles.statCard, { marginTop: 12 }]}>
                            <Text style={styles.statLabel}>ATTENDANCE RATE</Text>
                            <View style={styles.statValueRow}>
                                <Text style={styles.statBigValue}>
                                    {attendance ? `${attendance}%` : "—"}
                                </Text>
                                {attendanceChange && (
                                    <Text style={[
                                        styles.statSubtext,
                                        { color: attendanceChange > 0 ? "#00D4AA" : "#ff4444" },
                                    ]}>
                                        {attendanceChange > 0 ? "+" : ""}{attendanceChange}% from last Semester
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* ═══ Action Buttons ═══ */}
                        <View style={styles.actionsSection}>
                            {/* Edit Profile */}
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                                <View style={styles.actionLeft}>
                                    <Feather name="edit" size={18} color="#fff" />
                                    <Text style={styles.actionText}>EDIT PROFILE</Text>
                                </View>
                                <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.3)" />
                            </TouchableOpacity>

                            {/* Logout */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.actionButtonDanger]}
                                onPress={handleLogout}
                                activeOpacity={0.7}
                            >
                                <View style={styles.actionLeft}>
                                    <Feather name="log-out" size={18} color="#ff4d4d" />
                                    <Text style={[styles.actionText, styles.actionTextDanger]}>LOGOUT</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Delete Account */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.actionButtonDelete]}
                                onPress={handleDeleteAccount}
                                activeOpacity={0.7}
                            >
                                <View style={styles.actionLeft}>
                                    <MaterialIcons name="delete-outline" size={20} color="#ff4d4d" />
                                    <Text style={[styles.actionText, styles.actionTextDanger]}>DELETE ACCOUNT</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </AppBackgroundStudents>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    loadingBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
    },

    loadingText: {
        color: "rgba(255,255,255,0.4)",
        marginTop: 12,
        fontSize: 14,
    },

    // ─── Avatar ───
    avatarSection: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 24,
    },

    avatarRing: {
        marginBottom: 16,
    },

    avatarGradientRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        padding: 3,
        justifyContent: "center",
        alignItems: "center",
    },

    avatarInner: {
        width: 114,
        height: 114,
        borderRadius: 57,
        backgroundColor: "#0D0119",
        justifyContent: "center",
        alignItems: "center",
    },

    userName: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },

    userEmail: {
        color: "#A0A3BD",
        fontSize: 12,
        marginTop: 4,
    },

    // ─── Badges ───
    badgeSection: {
        alignItems: "center",
        marginBottom: 24,
    },

    badgeFull: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        backgroundColor: "rgba(255,255,255,0.04)",
        marginBottom: 10,
    },

    badgeRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
    },

    badge: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        backgroundColor: "rgba(255,255,255,0.04)",
    },

    badgeText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 10,
        fontWeight: "600",
        letterSpacing: 0.8,
    },

    // ─── Stat Cards ───
    statCard: {
        borderRadius: 18,
        padding: 20,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        marginBottom: 4,
    },

    statLabel: {
        color: "#00D4AA",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: 6,
    },

    statValueRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 12,
    },

    statBigValue: {
        color: "#fff",
        fontSize: 40,
        fontWeight: "800",
    },

    statSubtext: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 13,
        fontWeight: "500",
    },

    // ─── Action Buttons ───
    actionsSection: {
        marginTop: 24,
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.04)",
        marginBottom: 10,
    },

    actionButtonDanger: {
        borderColor: "rgba(255,77,77,0.15)",
        backgroundColor: "rgba(255,77,77,0.04)",
    },

    actionButtonDelete: {
        borderColor: "rgba(255,77,77,0.15)",
        backgroundColor: "rgba(255,77,77,0.04)",
    },

    actionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    actionText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 1,
    },

    actionTextDanger: {
        color: "#ff4d4d",
    },
});