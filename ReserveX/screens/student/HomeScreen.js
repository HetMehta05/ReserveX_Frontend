import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

import { getAvailableRooms, getRoomStatus, getStudentTimetable } from "../../services/api";
import { useUser } from "../../context/UserContext";
import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";


export default function HomeScreen() {
    const { user, loading } = useUser();
    const token = user?.token;

    const [availableRooms, setAvailableRooms] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [nextLecture, setNextLecture] = useState(null);
    const hasCurrent = !!currentLecture;
    const hasNext = !!nextLecture;
    const hasAnyLecture = hasCurrent || hasNext;

    const getCurrentDateTime = () => {
        const now = new Date();

        const date = now.toISOString().split("T")[0]; // ✅ REQUIRED

        const pad = (n) => n.toString().padStart(2, "0");

        const startTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

        const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

        return { date, startTime, endTime };
    };

    useEffect(() => {
        if (loading) return;
        if (!user?.token || !user?.id) return;

        loadData();
        loadTimetable();

        const interval = setInterval(() => {
            loadData();
        }, 2 * 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [user?.token, user?.id, loading]);



    const loadData = async () => {
        try {
            const { date, startTime, endTime } = getCurrentDateTime();

            const rooms = await getAvailableRooms(date, startTime, endTime);

            setAvailableRooms(rooms || []);
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Failed to load data",
                text2: err?.message || "Unable to fetch available rooms",
                position: "top",
                visibilityTime: 3000,
            });
        }
    };

    const loadTimetable = async () => {
        try {
            if (!user?.id) return;

            const data = await getStudentTimetable(user.id);

            processLectures(data.timetable || []);
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Timetable Error",
                text2: err?.message || "Unable to fetch timetable",
                position: "top",
                visibilityTime: 3000,
            });
        }
    };

    const processLectures = (timetable) => {
        const now = new Date();

        const todayLectures = timetable
            .map((lec) => {
                const start = new Date(lec.startTime);
                const end = new Date(lec.endTime);
                return { ...lec, start, end };
            })
            .filter(
                (lec) => lec.start.toDateString() === now.toDateString()
            )
            .sort((a, b) => a.start - b.start);

        const current = todayLectures.find(
            (lec) => now >= lec.start && now <= lec.end
        );

        const next = todayLectures.find((lec) =>
            current ? lec.start > current.end : lec.start > now
        );

        setCurrentLecture(current || null);
        setNextLecture(next || null);
    };

    return (
        <AppBackgroundStudents>
            <ScrollView contentContainerStyle={styles.container}>

                <Header />

                {/* SEARCH BAR */}
                <LinearGradient
                    colors={["#1A103D", "#2A1E5C", "rgba(255,255,255,0.08)"]}
                    locations={[0, 0.75, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.9 }}
                    style={styles.searchBar}
                >
                    <TextInput
                        placeholder="search for anything..."
                        placeholderTextColor="#A0A3BD"
                        style={styles.searchInput}
                    />
                    <Ionicons name="search" size={18} color="#A0A3BD" />
                </LinearGradient>

                {/* DATE */}
                <Text style={styles.date}>WEDNESDAY, APRIL 8</Text>

                {/* GREETING */}
                <Text style={styles.greeting}>
                    <Text style={styles.name}>Hello, Prisha</Text>
                </Text>

                {/* CURRENT LECTURE */}
                {/* ───────── LECTURE SECTION ───────── */}

                {hasAnyLecture ? (
                    <>
                        {/* ✅ CURRENT LECTURE */}
                        {hasCurrent && (
                            <LinearGradient
                                colors={["#1A103D", "#2A1E5C", "rgba(255,255,255,0.08)"]}
                                locations={[0, 0.75, 1]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0.9 }}
                                style={styles.card}
                            >
                                <View style={styles.rowBetween}>
                                    <Text style={[styles.cardLabel, { color: "#81ECFF" }]}>
                                        CURRENT LECTURE
                                    </Text>

                                    <View style={styles.liveBadge}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveText}>LIVE NOW</Text>
                                    </View>
                                </View>

                                <Text style={styles.title}>
                                    {currentLecture.subject}
                                </Text>

                                <Text style={styles.infoText}>
                                    {currentLecture.start.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })} - {currentLecture.end.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </LinearGradient>
                        )}

                        {/* ✅ NEXT LECTURE (works for both cases) */}
                        {hasNext && (
                            <LinearGradient
                                colors={["#0F0A2B", "#1A103D", "rgba(255,255,255,0.06)"]}
                                locations={[0, 0.75, 1]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0.9 }}
                                style={styles.card}
                            >
                                <Text style={styles.cardLabel}>
                                    {hasCurrent ? "UP NEXT" : "NEXT LECTURE"}
                                </Text>

                                <Text style={styles.title}>
                                    {nextLecture.subject}
                                </Text>

                                <Text style={styles.timeHighlight}>
                                    {nextLecture.start.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </LinearGradient>
                        )}
                    </>
                ) : (
                    <LinearGradient
                        colors={["#0F0A2B", "#1A103D", "rgba(255,255,255,0.05)"]}
                        locations={[0, 0.75, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0.9 }}
                        style={styles.emptyCard}
                    >
                        <View style={styles.emptyIcon}>
                            <Ionicons name="calendar-outline" size={28} color="#81ECFF" />
                        </View>

                        <Text style={styles.emptyTitle}>
                            No Lectures Today
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Enjoy your free day or catch up on something productive.
                        </Text>
                    </LinearGradient>
                )}

                {/* UNOCCUPIED */}
                <Text style={styles.sectionTitle}>Unoccupied Classrooms</Text>

                <View style={styles.pillContainer}>
                    {availableRooms.length > 0 ? (
                        availableRooms.map((room) => (
                            <LinearGradient
                                key={room.id}
                                colors={["#1A103D", "rgba(255,255,255,0.08)"]}
                                style={styles.pill}
                            >
                                <Text style={styles.pillText}>
                                    {room.name}
                                </Text>
                            </LinearGradient>
                        ))
                    ) : (
                        <View style={styles.noRoomsBox}>
                            <Ionicons name="business-outline" size={22} color="#A0A3BD" />

                            <Text style={styles.noRoomsText}>
                                No classrooms available right now
                            </Text>

                            <Text style={styles.noRoomsSubText}>
                                All rooms are currently occupied. Try again later.
                            </Text>
                        </View>
                    )}
                </View>

                {/* HIGHLIGHTS */}
                <Text style={styles.sectionTitle}>Today’s Highlights</Text>

                <LinearGradient
                    colors={["#1A103D", "rgba(255,255,255,0.08)"]}
                    style={styles.highlightCard}
                >
                    <Text style={styles.highlightText}>
                        Extra Lecture at 4:00 pm
                    </Text>

                    <Text style={styles.highlightText}>
                        Operating Systems
                    </Text>
                    <Text style={styles.subHighlight}>
                        CLASSROOM 63
                    </Text>

                    <Text style={styles.highlightText}>
                        You’ve RSVP’d to Celestia - 12:00 pm to 6:00 pm
                    </Text>
                    <Text style={styles.subHighlight}>
                        6TH FLOOR - COMPS DEPARTMENT
                    </Text>
                </LinearGradient>
            </ScrollView>
        </AppBackgroundStudents>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 120,
    },

    logo: {
        fontSize: 15,
        fontFamily: 'Times New Roman',
        marginVertical: 30,
        color: '#fff',
    },

    /* SEARCH */
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 20,
    },

    searchInput: {
        flex: 1,
        color: "#fff",
        fontSize: 14,
    },

    date: {
        color: "#A0A3BD",
        fontSize: 12,
        letterSpacing: 1,
        marginBottom: 6,
    },

    greeting: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 20,
    },

    name: {
        color: "#81ECFF",
    },

    card: {
        borderRadius: 22,
        padding: 18,
        marginBottom: 20,
        height: 160,
        justifyContent: "center",
    },

    cardLabel: {
        color: "#A0A3BD",
        fontSize: 12,
        marginBottom: 8,
        letterSpacing: 1,
    },

    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 14,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    liveBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3A1C3F",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    liveDot: {
        width: 6,
        height: 6,
        backgroundColor: "#FF4D6D",
        borderRadius: 3,
        marginRight: 6,
    },

    liveText: {
        color: "#FF4D6D",
        fontSize: 10,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    infoBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    iconBg: {
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 8,
        borderRadius: 10,
        marginRight: 6,
    },

    infoLabel: {
        color: "#A0A3BD",
        fontSize: 10,
    },

    infoText: {
        color: "#fff",
        fontSize: 12,
    },

    timeHighlight: {
        color: "#81ECFF",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 4,
    },

    arrowBtn: {
        position: "absolute",
        right: 15,
        bottom: 15,
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 12,
        borderRadius: 25,
    },

    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },

    pillContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },

    pill: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },

    pillText: {
        color: "#fff",
        fontSize: 12,
    },

    noRoomsBox: {
        width: "100%",
        padding: 16,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.03)",
        alignItems: "center",
        justifyContent: "center",
    },

    noRoomsText: {
        color: "#fff",
        fontSize: 13,
        marginTop: 8,
        fontWeight: "500",
    },

    noRoomsSubText: {
        color: "#A0A3BD",
        fontSize: 11,
        marginTop: 4,
        textAlign: "center",
    },

    highlightCard: {
        padding: 16,
        borderRadius: 18,
    },

    highlightText: {
        color: "#fff",
        fontSize: 13,
        marginBottom: 4,
    },

    subHighlight: {
        color: "#A0A3BD",
        fontSize: 10,
        marginBottom: 8,
    },

    capacityText: {
        color: "#81ECFF",
        fontSize: 10,
        marginTop: 2,
    },

    noRoomsText: {
        color: "#A0A3BD",
        fontSize: 12,
        textAlign: "center",
        width: "100%",
    },

    emptyCard: {
        borderRadius: 22,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    emptyIcon: {
        backgroundColor: "rgba(129,236,255,0.1)",
        padding: 14,
        borderRadius: 50,
        marginBottom: 12,
    },

    emptyTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 6,
    },

    emptySubtitle: {
        color: "#A0A3BD",
        fontSize: 12,
        textAlign: "center",
    },
});