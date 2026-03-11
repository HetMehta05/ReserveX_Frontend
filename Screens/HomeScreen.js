import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { getAvailableRooms, getRoomStatus } from "../services/api";


export default function HomeScreen() {

    const [availableRooms, setAvailableRooms] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {

            const rooms = await getAvailableRooms();
            setAvailableRooms(rooms);

            const status = await getRoomStatus();

            // Example logic for current lecture
            if (status.length > 0 && status[0].bookings.length > 0) {
                setCurrentLecture(status[0].name);
            }

        } catch (err) {
            console.log("API Error:", err);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
            showsVerticalScrollIndicator={false}
        >

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.logo}>ReserveX</Text>
                <View style={styles.headerIcons}>
                    <Ionicons name="notifications" size={24} color="#fff" />
                    <Ionicons name="person" size={24} color="#fff" style={{ marginLeft: 20 }} />
                </View>
            </View>

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
                                <Text style={styles.roomPillText}>{room.name}</Text>
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
    roomGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    roomPillContainer: { width: "23%", marginBottom: 15 },
    roomPillGradient: { borderRadius: 12, alignItems: "center", paddingVertical: 8 },
    roomPillText: { color: "#fff", fontSize: 14, fontWeight: '600' },
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
        paddingVertical: 20,
        opacity: 0.6
    },

    emptyText: {
        color: "#aaa",
        fontSize: 16
    },
});