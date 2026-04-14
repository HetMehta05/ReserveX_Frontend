import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import { getRoomStatus, getAllRooms, getDepartments, getRoomTimetable } from "../../services/api";

// ─── Helpers ───
const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI"];

function getWeekDates(referenceDate) {
    const d = new Date(referenceDate);
    const day = d.getDay(); // 0=Sun
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    return Array.from({ length: 5 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
    });
}

function getMonthYearLabel(date) {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function formatDateParam(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function RoomScreen() {
    const { token } = useUser();

    // ─── Calendar State ───
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const weekDates = getWeekDates(currentWeekStart);

    // ─── Filter State ───
    const FILTERS = ["Vacant", "Labs", "Rooms", "Department ▾"];
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [showDeptDropdown, setShowDeptDropdown] = useState(false);

    // ─── Room Data ───
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ─── Fetch departments on mount ───
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const data = await getDepartments();
                let deptList = [];
                if (Array.isArray(data)) deptList = data;
                else if (data?.departments) deptList = data.departments;
                else if (data?.data) deptList = data.data;
                setDepartments(deptList);
            } catch (err) {
                console.log("Dept fetch error:", err.message);
            }
        };
        fetchDepts();
    }, []);

    // ─── Fetch rooms when date changes ───
    const fetchRooms = useCallback(async () => {
        try {
            const dateStr = formatDateParam(selectedDate);
            let data;

            // Try status endpoint first (richer data with schedules)
            try {
                data = await getRoomStatus(dateStr);
            } catch (statusErr) {
                console.log("Room status unavailable:", statusErr.message);
                // Fall back to basic room list
                data = await getAllRooms();
            }

            // Normalize the response
            let roomList = [];
            if (Array.isArray(data)) {
                roomList = data;
            } else if (data?.rooms) {
                roomList = data.rooms;
            } else if (data?.data) {
                roomList = data.data;
            }

            // Normalize each room's fields
            roomList = roomList.map((room) => ({
                ...room,
                _id: room._id || room.id,
                name: room.name || room.roomName || `Room ${room._id || room.id}`,
                department: extractDept(room),
                type: room.type || room.roomType || "classroom",
                schedule: room.schedule || room.timetable || room.slots || room.timeSlots || [],
                status: room.status || (room.isAvailable ? "available" : null),
                capacity: room.capacity || null,
            }));

            setRooms(roomList);
        } catch (err) {
            console.log("Room fetch error:", err);
            Toast.show({
                type: "error",
                text1: "Failed to load rooms",
                text2: err.message,
                position: "top",
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        setLoading(true);
        fetchRooms();
    }, [fetchRooms]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRooms();
    };

    // ─── Extract department name from various shapes ───
    function extractDept(room) {
        const dept = room.department || room.dept;
        if (!dept) return "";
        if (typeof dept === "string") return dept;
        return dept.name || dept.departmentName || "";
    }

    // ─── Calendar navigation ───
    const goToPrevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);
        setCurrentWeekStart(prev);
    };

    const goToNextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);
        setCurrentWeekStart(next);
    };

    const isSelected = (date) =>
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

    // ─── Filter handlers ───
    const handleFilterPress = (filter) => {
        if (filter === "Department ▾") {
            setShowDeptDropdown(!showDeptDropdown);
            return;
        }
        setSelectedFilter(selectedFilter === filter ? null : filter);
        setShowDeptDropdown(false);
    };

    // ─── Determine room availability ───
    const getRoomAvailability = (room) => {
        if (room.status === "available" || room.status === "open") return "AVAILABLE";
        if (room.status === "occupied" || room.status === "closed" || room.status === "locked") return "OCCUPIED";

        const slots = room.schedule || [];
        if (slots.length === 0) return "AVAILABLE";

        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

        const currentSlot = slots.find((s) =>
            s.startTime && s.endTime && s.startTime <= currentTime && s.endTime > currentTime
        );

        if (!currentSlot || (!currentSlot.subject && !currentSlot.class && !currentSlot.className)) {
            return "AVAILABLE";
        }
        return "OCCUPIED";
    };

    // ─── Apply filters ───
    const getFilteredRooms = () => {
        let filtered = [...rooms];

        if (selectedFilter === "Vacant") {
            filtered = filtered.filter((r) => getRoomAvailability(r) === "AVAILABLE");
        } else if (selectedFilter === "Labs") {
            filtered = filtered.filter((r) => {
                const name = (r.name || "").toLowerCase();
                const type = (r.type || "").toLowerCase();
                return name.includes("lab") || type.includes("lab");
            });
        } else if (selectedFilter === "Rooms") {
            filtered = filtered.filter((r) => {
                const name = (r.name || "").toLowerCase();
                const type = (r.type || "").toLowerCase();
                return !name.includes("lab") && !type.includes("lab");
            });
        }

        if (selectedDept) {
            filtered = filtered.filter((r) =>
                r.department.toLowerCase().includes(selectedDept.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredRooms = getFilteredRooms();

    return (
        <AppBackgroundStudents>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#C281FF"
                        colors={["#C281FF"]}
                    />
                }
            >
                <Header currentScreen="Rooms" />

                <Text style={styles.sectionLabel}>ACADEMIC SPACES</Text>
                <Text style={styles.pageTitle}>Rooms</Text>

                {/* ═══ Month Navigation ═══ */}
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={goToPrevWeek} style={styles.monthArrow}>
                        <Feather name="chevron-left" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.monthLabel}>{getMonthYearLabel(weekDates[0])}</Text>
                    <TouchableOpacity onPress={goToNextWeek} style={styles.monthArrow}>
                        <Feather name="chevron-right" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* ═══ Week Day Strip ═══ */}
                <View style={styles.weekStrip}>
                    {weekDates.map((date, index) => {
                        const active = isSelected(date);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.dayBox, active && styles.dayBoxActive]}
                                onPress={() => setSelectedDate(date)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>
                                    {WEEKDAYS[index]}
                                </Text>
                                <Text style={[styles.dayNumber, active && styles.dayNumberActive]}>
                                    {String(date.getDate()).padStart(2, "0")}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ═══ Filter Chips ═══ */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FILTERS.map((filter, idx) => {
                        const isActive = selectedFilter === filter ||
                            (filter === "Department ▾" && selectedDept);
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.filterChip, isActive && styles.filterChipActive]}
                                onPress={() => handleFilterPress(filter)}
                            >
                                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                    {filter === "Department ▾" && selectedDept
                                        ? selectedDept
                                        : filter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* ═══ Department Dropdown ═══ */}
                {showDeptDropdown && (
                    <View style={styles.deptDropdown}>
                        <TouchableOpacity
                            style={styles.deptOption}
                            onPress={() => { setSelectedDept(null); setShowDeptDropdown(false); }}
                        >
                            <Text style={[styles.deptOptionText, !selectedDept && { color: "#C281FF" }]}>
                                All Departments
                            </Text>
                        </TouchableOpacity>
                        {departments.map((dept) => {
                            const deptName = typeof dept === "string" ? dept : dept.name || dept.department || String(dept);
                            const deptId = dept._id || dept.id || deptName;
                            return (
                                <TouchableOpacity
                                    key={deptId}
                                    style={styles.deptOption}
                                    onPress={() => { setSelectedDept(deptName); setShowDeptDropdown(false); }}
                                >
                                    <Text style={[styles.deptOptionText, selectedDept === deptName && { color: "#C281FF" }]}>
                                        {deptName}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* ═══ Room Cards ═══ */}
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#C281FF" />
                        <Text style={styles.loadingText}>Loading rooms...</Text>
                    </View>
                ) : filteredRooms.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={50} color="rgba(255,255,255,0.2)" />
                        <Text style={styles.emptyTitle}>No rooms found</Text>
                        <Text style={styles.emptySubtitle}>Try changing filters or date</Text>
                    </View>
                ) : (
                    filteredRooms.map((room) => {
                        const availability = getRoomAvailability(room);
                        const isAvailable = availability === "AVAILABLE";
                        const slots = room.schedule || [];

                        return (
                            <View key={room._id} style={styles.roomCard}>
                                {/* Header Row */}
                                <View style={styles.roomCardHeader}>
                                    <Text style={styles.roomName}>{room.name}</Text>
                                    <View style={styles.statusBadge}>
                                        <View style={[styles.statusDot, isAvailable ? styles.dotGreen : styles.dotRed]} />
                                        <Text style={[styles.statusText, isAvailable ? styles.statusGreen : styles.statusRed]}>
                                            {availability}
                                        </Text>
                                    </View>
                                </View>

                                {/* Department */}
                                {room.department ? (
                                    <Text style={styles.roomDepartment}>{room.department.toUpperCase()}</Text>
                                ) : null}

                                {/* Capacity */}
                                {room.capacity && (
                                    <Text style={styles.roomCapacity}>Capacity: {room.capacity}</Text>
                                )}

                                {/* Time Slots (if available) */}
                                {slots.length > 0 && (
                                    <View style={styles.slotsContainer}>
                                        {slots.slice(0, 4).map((slot, idx) => {
                                            const slotSubject = slot.subject || slot.subjectName || "";
                                            const slotClass = slot.class || slot.className || slot.section || "";
                                            const isVacant = !slotSubject && !slotClass;
                                            const displayText = isVacant
                                                ? "Vacant"
                                                : `${slotClass}${slotSubject ? ` ${slotSubject}` : ""}`.trim();

                                            return (
                                                <View key={idx} style={styles.slotRow}>
                                                    <Text style={styles.slotTime}>
                                                        {slot.startTime || "—"} - {slot.endTime || "—"}
                                                    </Text>
                                                    <Text style={[styles.slotValue, isVacant ? styles.slotVacant : styles.slotOccupied]}>
                                                        {displayText}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}

                                {/* If no slots, show a simple status line */}
                                {slots.length === 0 && (
                                    <View style={styles.noSlotsRow}>
                                        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.3)" />
                                        <Text style={styles.noSlotsText}>No schedule data for this date</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </AppBackgroundStudents>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "transparent",
    },

    sectionLabel: {
        color: "#00D4AA",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 2,
        marginBottom: 6,
    },

    pageTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 20,
    },

    // ─── Month Navigation ───
    monthNav: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    monthArrow: { padding: 8 },
    monthLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginHorizontal: 16,
    },

    // ─── Week Strip ───
    weekStrip: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18,
    },
    dayBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        minWidth: 56,
    },
    dayBoxActive: {
        backgroundColor: "rgba(194,129,255,0.2)",
        borderColor: "#C281FF",
    },
    dayLabel: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    dayLabelActive: { color: "#fff" },
    dayNumber: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    dayNumberActive: { color: "#fff" },

    // ─── Filter Chips ───
    filterRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 22,
        paddingVertical: 2,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        backgroundColor: "rgba(255,255,255,0.04)",
    },
    filterChipActive: {
        backgroundColor: "rgba(194,129,255,0.15)",
        borderColor: "#C281FF",
    },
    filterChipText: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
        fontWeight: "600",
    },
    filterChipTextActive: { color: "#C281FF" },

    // ─── Dept Dropdown ───
    deptDropdown: {
        backgroundColor: "rgba(20,5,40,0.95)",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        padding: 6,
        marginBottom: 16,
    },
    deptOption: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    deptOptionText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 13,
        fontWeight: "500",
    },

    // ─── Room Card ───
    roomCard: {
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        padding: 18,
        marginBottom: 16,
    },
    roomCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    roomName: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotGreen: {
        backgroundColor: "#39ff14",
        shadowColor: "#39ff14",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 4,
    },
    dotRed: {
        backgroundColor: "#ff4444",
        shadowColor: "#ff4444",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    statusGreen: { color: "#39ff14" },
    statusRed: { color: "#ff4444" },
    roomDepartment: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 1,
        marginBottom: 8,
    },
    roomCapacity: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 11,
        marginBottom: 8,
    },

    // ─── Slots ───
    slotsContainer: { marginTop: 6 },
    slotRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
    },
    slotTime: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
        fontWeight: "500",
    },
    slotValue: { fontSize: 13, fontWeight: "600" },
    slotVacant: { color: "#00D4AA" },
    slotOccupied: { color: "rgba(255,255,255,0.7)" },

    noSlotsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
        paddingVertical: 4,
    },
    noSlotsText: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 12,
    },

    // ─── Loading & Empty ───
    loadingBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60,
    },
    loadingText: {
        color: "rgba(255,255,255,0.4)",
        marginTop: 12,
        fontSize: 14,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60,
    },
    emptyTitle: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 12,
    },
    emptySubtitle: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 13,
        marginTop: 6,
    },
});