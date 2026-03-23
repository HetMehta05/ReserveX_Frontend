import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";

export default function RoomScreen() {
    const [selectedFilter, setSelectedFilter] = useState("Any Occupancy");

    const filters = ["Mechanical", "Laboratory", "Any Occupancy"];

    const rooms = [
        { id: 1, status: "open" },
        { id: 2, status: "open" },
        { id: 3, status: "occupied" },
        { id: 4, status: "open" },
    ];

    return (
        <AppBackgroundStudents>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Header currentScreen="Rooms" />

                {/* Filter section */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
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

                {/* Rooms List */}
                <View style={styles.roomsList}>
                    {rooms.map((room) => (
                        <View key={room.id} style={styles.roomCard}>
                            <View style={[
                                styles.statusDot,
                                room.status === "open" ? styles.statusOpen : styles.statusOccupied
                            ]} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </AppBackgroundStudents>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 22, backgroundColor: "transparent" },
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
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 2
    },
    filterPill: {
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderRadius: 15,
        backgroundColor: "rgba(255,255,255,0.8)",
        marginHorizontal: 3,
        flex: 1,
        alignItems: 'center'
    },
    filterPillSelected: {
        backgroundColor: "rgba(255,255,255,0.95)",
    },
    filterText: {
        color: "#000",
        fontSize: 10,
        fontWeight: "600",
        fontFamily: "monospace" // to match the images
    },
    filterTextSelected: {
        color: "#000",
    },
    roomsList: {
        flexDirection: "column",
        gap: 20,
    },
    roomCard: {
        height: 140,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        position: 'relative',
        marginBottom: 20,
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