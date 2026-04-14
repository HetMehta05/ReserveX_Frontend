import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { getAvailableRooms, getRoomStatus } from "../../services/api";
import { useUser } from "../../context/UserContext";
import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";


export default function HomeScreen() {
    const { user, loading } = useUser();
    const token = user?.token;

    const [availableRooms, setAvailableRooms] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);

    const getCurrentDateTime = () => {
        const now = new Date();

        const date = now.toISOString().split("T")[0]; // YYYY-MM-DD

        const pad = (n) => n.toString().padStart(2, "0");

        const startTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

        // +2 hours window
        const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

        return { date, startTime, endTime };
    };

    useEffect(() => {
        // Only load data if token is ready
        if (!loading && token) {
            loadData();

            // Set interval to refresh every 2 hours
            const interval = setInterval(() => {
                loadData();
            }, 2 * 60 * 60 * 1000); // 2 hours

            return () => clearInterval(interval);
        }
    }, [token, loading]);

    const loadData = async () => {
        try {
            const { date, startTime, endTime } = getCurrentDateTime();

            const response = await fetch(
                `https://reservex.onrender.com/api/rooms/available?date=${date}&startTime=${startTime}&endTime=${endTime}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ key fix
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            setAvailableRooms(data.availableRooms || []);
        } catch (err) {
            console.log("API Error:", err);
        }
    };

    return (
        <AppBackgroundStudents>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
            >

                {/* HEADER */}
                <Header />

                {/* SEARCH BAR */}
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder="search for anything..."
                        placeholderTextColor="#aaa"
                        style={styles.searchInput}
                    />
                    <Ionicons name="search" size={18} color="#fff" />
                </View>

                {/* CURRENT LECTURE */}
                <Text style={styles.sectionTitle}>Current Lecture</Text>
                <View style={styles.currentCard}>
                    {currentLecture ? (
                        <Text style={styles.roomText}>{currentLecture}</Text>
                    ) : (
                        <View style={styles.emptyShell}>
                            <Ionicons name="school-outline" size={26} color="#888" />
                            <Text style={styles.emptyText}>No ongoing lecture</Text>
                        </View>
                    )}
                </View>

                {/* UNOCCUPIED CLASSROOMS */}
                <Text style={styles.sectionTitle}>Unoccupied Classrooms</Text>

                <View style={styles.roomGrid}>
                    {availableRooms.length > 0 ? (
                        availableRooms.map((room) => (
                            <TouchableOpacity
                                key={room.id}
                                style={styles.roomPillContainer}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#C281FF', '#5623CD']}
                                    style={styles.roomPillGradient}
                                >
                                    <Text style={styles.roomPillText}
                                        numberOfLines={1}
                                        ellipsizeMode="tail">
                                        {room.name}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyRooms}>
                            <Ionicons name="cube-outline" size={26} color="#888" />
                            <Text style={styles.emptyText}>No rooms available</Text>
                        </View>
                    )}
                </View>

                {/* TODAY'S HIGHLIGHTS */}
                <Text style={[styles.sectionTitle, { textAlign: "right", marginTop: 10 }]}>
                    Todays Highlights
                </Text>

                <View style={styles.highlightCard} />

            </ScrollView>
        </AppBackgroundStudents>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 22, backgroundColor: "transparent" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    logo: { color: "#fff", fontSize: 18, fontWeight: '600' },
    headerIcons: { flexDirection: "row" },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 35,
    },
    searchInput: { flex: 1, color: "#fff", fontSize: 14 },
    sectionTitle: { color: "#fff", fontSize: 16, marginBottom: 15, fontWeight: '500' },
    currentCard: {
        height: 80,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.05)",
        justifyContent: "center",
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 35,
    },
    roomText: { color: "#fff", fontSize: 14 },
    roomGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },
    roomPillContainer: {
        marginRight: 10,
        marginBottom: 12,
        flexGrow: 1,
        minWidth: "28%", // 🔥 controls how many fit per row (~3–4)
        maxWidth: "48%",
    },
    roomPillGradient: {
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    roomPillText: { color: "#fff", fontSize: 14, fontWeight: '600', textAlign: "center", },
    highlightCard: {
        height: 200,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: 10,
    },
    emptyShell: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },

    emptyRooms: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        paddingVertical: 20,
        opacity: 0.6
    },

    emptyText: {
        color: "#aaa",
        fontSize: 16
    },
});