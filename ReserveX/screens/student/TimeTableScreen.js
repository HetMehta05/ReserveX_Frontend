import React, { useState, useEffect, useMemo } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import { getStudentTimetable } from "../../services/api";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI"];

/* ───────────────────────── UTIL FUNCTIONS ───────────────────────── */

const getWeekDates = (referenceDate) => {
    const d = new Date(referenceDate);
    const day = d.getDay();

    const mondayOffset = day === 0 ? -6 : 1 - day;

    return Array.from({ length: 5 }, (_, i) => {
        const date = new Date(d);
        date.setDate(d.getDate() + mondayOffset + i);
        return date;
    });
};

const getMonthYearLabel = (date) =>
    date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });

const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function TimetableScreen() {
    const { user } = useUser();

    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timetableData, setTimetableData] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ───────── WEEK NAVIGATION ───────── */

    const weekDates = useMemo(
        () => getWeekDates(currentWeekStart),
        [currentWeekStart]
    );

    const goToPrevWeek = () => {
        setCurrentWeekStart((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return d;
        });
    };

    const goToNextWeek = () => {
        setCurrentWeekStart((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return d;
        });
    };

    /* ───────── FETCH DATA ───────── */

    useEffect(() => {
        if (!user?.id) return;

        const fetchTimetable = async () => {
            try {
                setLoading(true);

                const data = await getStudentTimetable(user.id, user.token);
                setTimetableData(data?.timetable || []);
            } catch (err) {
                Toast.show({
                    type: "error",
                    text1: "Failed to load timetable",
                    text2: err?.message || "Something went wrong while fetching schedule",
                    position: "top",
                    visibilityTime: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, [user?.id, user?.token]);

    /* ───────── FILTERED DATA ───────── */
    const getDayOfWeek = (date) => {
        const jsDay = date.getDay(); // 0 (Sun) → 6 (Sat)
        return jsDay === 0 ? 7 : jsDay; // convert to 1–7 (Mon–Sun style)
    };

    useEffect(() => {
        const today = new Date();

        const day = today.getDay(); // 0 (Sun) - 6 (Sat)

        // force Monday
        const mondayOffset = day === 0 ? -6 : 1 - day;
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);

        setSelectedDate(monday);
        setCurrentWeekStart(monday);
    }, []);

    const isValidSlot = (item) =>
        item?.timeSlot?.startMinutes != null &&
        item?.timeSlot?.endMinutes != null;

    const formatTime = (slot) => {
        const startHrs = Math.floor(slot.startMinutes / 60);
        const startMins = slot.startMinutes % 60;

        const endHrs = Math.floor(slot.endMinutes / 60);
        const endMins = slot.endMinutes % 60;

        const format = (h, m) => {
            const period = h >= 12 ? "PM" : "AM";
            const hour12 = h % 12 === 0 ? 12 : h % 12;
            return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
        };

        return `${format(startHrs, startMins)} - ${format(endHrs, endMins)}`;
    };

    const filteredTimetable = useMemo(() => {
        const selectedDay = getDayOfWeek(selectedDate);

        return timetableData
            .filter((item) => item.dayOfWeek === selectedDay)
            .filter((item) => item.timeSlot?.startMinutes != null && item.timeSlot?.endMinutes != null)
            .sort((a, b) => a.timeSlot.startMinutes - b.timeSlot.startMinutes);
    }, [timetableData, selectedDate]);

    /* ───────── HELPERS ───────── */

    const isSelected = (date) => isSameDay(date, selectedDate);



    /* ───────── UI ───────── */

    return (
        <AppBackgroundStudents>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header />

                {/* ─── HEADER ─── */}
                <Text style={styles.sectionLabel}>ACADEMIC JOURNEY</Text>
                <Text style={styles.pageTitle}>Your Timetable</Text>

                {/* ─── ATTENDANCE ─── */}
                <LinearGradient
                    colors={["#131027", "#1a1633", "#ffffff10"]}
                    locations={[0, 0.75, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.9 }}
                    style={styles.attendanceCard}
                >
                    <Text style={styles.attendanceLabel}>ATTENDANCE RATE</Text>

                    <View style={styles.attendanceRow}>
                        <Text style={styles.attendanceValue}>94%</Text>
                        <Text style={styles.attendanceChange}>
                            +2.4% from last week
                        </Text>
                    </View>
                </LinearGradient>

                {/* ─── MONTH NAV ─── */}
                <View style={styles.monthPill}>
                    <TouchableOpacity onPress={goToPrevWeek}>
                        <Feather name="chevron-left" size={20} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.monthLabel}>
                        {getMonthYearLabel(weekDates[0])}
                    </Text>

                    <TouchableOpacity onPress={goToNextWeek}>
                        <Feather name="chevron-right" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* ─── WEEK STRIP ─── */}
                <View style={styles.weekStrip}>
                    {weekDates.map((date, index) => {
                        const active = isSelected(date);

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedDate(date)}
                                style={[
                                    styles.dayBox,
                                    active && styles.dayBoxActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dayLabel,
                                        active && styles.activeText,
                                    ]}
                                >
                                    {WEEKDAYS[index]}
                                </Text>

                                <Text
                                    style={[
                                        styles.dayNumber,
                                        active && styles.activeText,
                                    ]}
                                >
                                    {String(date.getDate()).padStart(2, "0")}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ─── TIMETABLE ─── */}
                <LinearGradient
                    colors={["#131027", "#1a1633", "#ffffff08"]}
                    locations={[0, 0.8, 1]}
                    style={styles.timetableCard}
                >
                    {loading ? (
                        <Text style={styles.loadingText}>Loading...</Text>
                    ) : filteredTimetable.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Feather name="calendar" size={42} color="rgba(255,255,255,0.25)" />

                            <Text style={styles.emptyTitle}>
                                No lectures today
                            </Text>

                            <Text style={styles.emptySubtitle}>
                                Enjoy your free day or catch up on your work.
                            </Text>
                        </View>
                    ) : (
                        filteredTimetable.map((item) => (
                            <View key={item.id} style={styles.row}>
                                <Text style={styles.time}>
                                    {formatTime(item.timeSlot)}
                                </Text>

                                <View style={styles.divider} />

                                <View style={styles.details}>
                                    <Text style={styles.subject}>
                                        {item.subject?.name || "Free Slot"}
                                    </Text>

                                    {item.room && (
                                        <Text style={styles.room}>
                                            {item.room.name}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </LinearGradient>
            </ScrollView>
        </AppBackgroundStudents>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    scrollContent: {
        paddingTop: 40,
        paddingBottom: 120,
    },

    /* ─── HEADER ─── */
    sectionLabel: {
        color: "#81ECFF",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 2,
    },

    pageTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 20,
    },

    /* ─── ATTENDANCE ─── */
    attendanceCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },

    attendanceLabel: {
        color: "#81ECFF",
        fontSize: 12,
        marginBottom: 8,
    },

    attendanceRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    attendanceValue: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "800",
        marginRight: 10,
    },

    attendanceChange: {
        color: "#81ECFF",
        fontSize: 12,
    },

    /* ─── MONTH NAV ─── */
    monthPill: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "rgba(19,16,39,0.9)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        marginBottom: 20,
    },

    monthLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    /* ─── WEEK STRIP ─── */
    weekStrip: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    dayBox: {
        minWidth: 60,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
        alignItems: "center",

        backgroundColor: "rgba(19,16,39,0.8)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    dayBoxActive: {
        backgroundColor: "#81ECFF",
    },

    dayLabel: {
        fontSize: 11,
        marginBottom: 4,
        color: "rgba(255,255,255,0.5)",
    },

    dayNumber: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },

    activeText: {
        color: "#000",
    },

    /* ─── TIMETABLE ─── */
    timetableCard: {
        borderRadius: 20,
        padding: 20,
    },

    row: {
        flexDirection: "row",
        alignItems: "stretch",
        marginBottom: 18,
    },

    time: {
        width: 75,
        fontSize: 13,
        color: "rgba(255,255,255,0.6)",
    },

    divider: {
        width: 2,
        marginHorizontal: 12,
        borderRadius: 2,
        backgroundColor: "#FFFFFF",
    },

    details: {
        flex: 1,
    },

    subject: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
    },

    room: {
        fontSize: 11,
        marginTop: 2,
        color: "#81ECFF",
    },

    loadingText: {
        color: "#fff",
    },

    emptyText: {
        color: "#aaa",
    },

    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },

    emptyTitle: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },

    emptySubtitle: {
        marginTop: 4,
        fontSize: 12,
        color: "rgba(255,255,255,0.5)",
        textAlign: "center",
    },
});