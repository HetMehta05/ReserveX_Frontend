import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import { getUserProfile } from "../../services/api";
import AppBackgroundCommittee from "../../layouts/AppBackgroundCommittee";

const CommitteeProfileScreen = () => {
    const { user, setUser, setToken, setCommitteeMode } = useUser();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);

            const userId = user?.id;
            const data = await getUserProfile(userId);

            setProfile(data);
        } catch (err) {
            console.log("Committee profile error:", err);
        } finally {
            setLoading(false);
        }
    };

    const parseCommittees = (committeeStatus) => {
        if (!committeeStatus) return [];

        return committeeStatus.split(",").map(item => {
            const match = item.trim().match(/(.+?)\((.+?)\)/);

            if (!match) {
                return {
                    name: item.trim(),
                    role: "MEMBER",
                };
            }

            return {
                name: match[1].trim(),
                role: match[2].trim(),
            };
        });
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
                            setCommitteeMode(false);

                        } catch (err) {
                            console.log("Logout failed:", err);
                            Alert.alert("Logout Failed", "Please try again");
                        }
                    },
                },
            ]
        );
    };

    const committees = parseCommittees(profile?.committeeStatus);
    const committeeStatus = profile?.committeeStatus || "—";
    const name = profile?.name || "Committee Member";
    const email = profile?.email || "—";
    const department = profile?.department?.name || "Department";
    const role = profile?.role || "MEMBER";

    const isLead = committeeStatus?.toLowerCase().includes("lead");

    return (
        <AppBackgroundCommittee>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>

                <Header currentScreen="Committee Profile" />

                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#00D4AA" />
                        <Text style={styles.loadingText}>Loading committee profile...</Text>
                    </View>
                ) : (
                    <>
                        {/* ───── PROFILE HEADER ───── */}
                        <View style={styles.profileHeader}>
                            <Ionicons name="person-circle" size={90} color="#00D4AA" />

                            <Text style={styles.name}>
                                {profile?.name || "Committee Member"}
                            </Text>

                            <Text style={styles.subtitle}>
                                Committee Portal Access
                            </Text>
                        </View>

                        {/* ───── COMMITTEE BLOCK ───── */}
                        <View style={styles.block}>

                            <Text style={styles.blockTitle}>
                                Your Committees
                            </Text>

                            {committees.length > 0 ? (
                                committees.map((c, index) => (
                                    <View key={index} style={styles.row}>

                                        <Text style={styles.leftText}>
                                            {c.name}
                                        </Text>

                                        <Text style={[
                                            styles.rightText,
                                            c.role === "LEAD" ? styles.lead : styles.member
                                        ]}>
                                            {c.role}
                                        </Text>

                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>
                                    No committee assigned
                                </Text>
                            )}
                        </View>

                        {/* ───── ACCESS BADGE ───── */}
                        <View style={styles.block}>
                            <Text style={styles.blockTitle}>Access Badge</Text>

                            <View style={styles.badgeBox}>
                                <Ionicons name="shield-checkmark" size={18} color="#00D4AA" />
                                <Text style={styles.badgeText}>
                                    Verified Committee Access
                                </Text>
                            </View>
                        </View>

                        {/* ───── SETTINGS ───── */}
                        <View style={styles.block}>

                            <TouchableOpacity style={styles.button}>
                                <Feather name="settings" size={18} color="#fff" />
                                <Text style={styles.buttonText}>Settings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: "rgba(0,212,170,0.08)" }]}
                                onPress={() => {
                                    Alert.alert(
                                        "Switch Mode",
                                        "Are you sure you want to leave Committee Mode and switch to Student Mode?",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            {
                                                text: "Yes, Switch",
                                                onPress: () => setCommitteeMode(false),
                                            },
                                        ]
                                    );
                                }}
                            >
                                <Ionicons name="person-outline" size={18} color="#00D4AA" />
                                <Text style={[styles.buttonText, { color: "#00D4AA" }]}>
                                    Switch to Student Mode
                                </Text>
                            </TouchableOpacity>

                        </View>

                        {/* ───── LOGOUT ───── */}
                        <View style={styles.block}>

                            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                                <MaterialIcons name="logout" size={18} color="#ff4d4d" />
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>

                        </View>
                    </>
                )}
            </ScrollView>
        </AppBackgroundCommittee>
    );
};

export default CommitteeProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
    },

    loader: {
        marginTop: 80,
        alignItems: "center",
    },

    loadingText: {
        color: "rgba(255,255,255,0.5)",
        marginTop: 10,
    },

    profileHeader: {
        alignItems: "center",
        marginTop: 25,
        marginBottom: 20,
    },

    name: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginTop: 10,
    },

    subtitle: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        marginTop: 4,
    },

    block: {
        marginTop: 18,
        padding: 14,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    blockTitle: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
        marginBottom: 10,
        fontWeight: "600",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },

    leftText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },

    rightText: {
        fontSize: 12,
        fontWeight: "700",
    },

    lead: {
        color: "#FFD700",
    },

    member: {
        color: "#00D4AA",
    },

    badgeBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    badgeText: {
        color: "#00D4AA",
        fontSize: 13,
        fontWeight: "600",
    },

    button: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.06)",
        marginBottom: 10,
    },

    buttonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },

    logout: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "rgba(255,0,0,0.06)",
    },

    logoutText: {
        color: "#ff4d4d",
        fontWeight: "600",
    },
    footer: {
        marginTop: 20,
        alignItems: "center",
    },

    footerText: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 11,
    },
});