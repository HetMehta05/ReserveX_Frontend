import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";

export default function RoomScreen() {

    const [selectedFilter, setSelectedFilter] = useState("Any Occupancy");

    const filters = ["Mechanical", "Laboratory", "Any Occupancy"];

    // ✅ Dummy Data (Improved)
    const rooms = [
        { id: 1, name: "A101", type: "Mechanical", status: "open" },
        { id: 2, name: "B202", type: "Laboratory", status: "open" },
        { id: 3, name: "C303", type: "Mechanical", status: "occupied" },
        { id: 4, name: "D404", type: "Laboratory", status: "open" },
        { id: 5, name: "E505", type: "Mechanical", status: "occupied" },
        { id: 6, name: "F606", type: "Laboratory", status: "open" },
    ];

    // ✅ Filtering Logic
    const filteredRooms =
        selectedFilter === "Any Occupancy"
            ? rooms
            : rooms.filter((room) => room.type === selectedFilter);

    return (
        <AppBackgroundStudents>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Header currentScreen="Rooms" />

                {/* FILTERS */}
                <View style={styles.filterContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {filters.map((filter, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.filterPill,
                                    selectedFilter === filter && styles.filterPillSelected
                                ]}
                                onPress={() => setSelectedFilter(filter)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedFilter === filter && styles.filterTextSelected
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* ROOMS LIST */}
                <View style={styles.roomsList}>
                    {filteredRooms.map((room) => (
                        <View key={room.id} style={styles.roomCard}>

                            {/* Room Info */}
                            <View style={styles.roomInfo}>
                                <Text style={styles.roomName}>{room.name}</Text>
                                <Text style={styles.roomType}>{room.type}</Text>
                            </View>

                            {/* Status Dot */}
                            <View style={[
                                styles.statusDot,
                                room.status === "open"
                                    ? styles.statusOpen
                                    : styles.statusOccupied
                            ]} />

                            {/* Status Text */}
                            <Text style={styles.statusText}>
                                {room.status === "open" ? "Available" : "Occupied"}
                            </Text>

                        </View>
                    ))}
                </View>
            </ScrollView>
        </AppBackgroundStudents>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 7, backgroundColor: "transparent" },

    filterContainer: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 20,
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 30,
    },

    filterScroll: {
        flexDirection: "row",
        alignItems: "center"
    },

    filterPill: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginRight: 10,
    },

    filterPillSelected: {
        backgroundColor: "#fff",
    },

    filterText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    filterTextSelected: {
        color: "#000",
    },

    roomsList: {
        flexDirection: "column",
    },

    roomCard: {
        height: 140,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        marginBottom: 20,
        padding: 20,
        justifyContent: "space-between"
    },

    roomInfo: {},

    roomName: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700"
    },

    roomType: {
        color: "#aaa",
        fontSize: 14,
        marginTop: 4
    },

    statusText: {
        color: "#ccc",
        fontSize: 12
    },

    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        top: 20,
        right: 20,
        elevation: 8,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },

    statusOpen: {
        backgroundColor: '#39ff14',
        shadowColor: '#39ff14',
    },

    statusOccupied: {
        backgroundColor: '#ff3333',
        shadowColor: '#ff3333',
    }
});