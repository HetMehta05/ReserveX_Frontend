import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    RefreshControl,
    ScrollView,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import { getAllEvents, registerForEvent } from "../../services/api";

const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width * 0.82;
const CARD_SPACING = 16;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function EventsScreen() {
    const { token } = useUser();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [registeringId, setRegisteringId] = useState(null);
    const scrollX = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const fetchEvents = useCallback(async () => {
        try {
            const data = await getAllEvents();
            let eventsList = [];
            if (Array.isArray(data)) {
                eventsList = data;
            } else if (data?.events) {
                eventsList = data.events;
            } else if (data?.data) {
                eventsList = data.data;
            }
            setEvents(eventsList);
        } catch (error) {
            console.log("Error fetching events:", error);
            Toast.show({
                type: "error",
                text1: "Unable to fetch events",
                text2: error.message,
                position: "top",
                visibilityTime: 3000,
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEvents();
    };

    const handleRSVP = async (eventId) => {
        try {
            setRegisteringId(eventId);
            await registerForEvent(eventId);
            Toast.show({
                type: "success",
                text1: "Registered!",
                text2: "You've been registered for this event.",
                position: "top",
            });
            fetchEvents();
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Registration Failed",
                text2: err.message,
                position: "top",
            });
        } finally {
            setRegisteringId(null);
        }
    };

    // ─── Safe field extractors ───
    const getOrganizer = (event) => {
        const org = event.organizer || event.club || event.committee || event.createdBy;
        if (!org) return "ORGANIZER";
        if (typeof org === "string") return org.toUpperCase();
        return (org.name || org.clubName || org.committeeName || org.username || "ORGANIZER").toUpperCase();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "TBA";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const day = d.getDate();
            const suffix = [1, 21, 31].includes(day) ? "st"
                : [2, 22].includes(day) ? "nd"
                : [3, 23].includes(day) ? "rd" : "th";
            const month = d.toLocaleString("en-US", { month: "short" });
            return `${day}${suffix} ${month}`;
        } catch {
            return dateStr;
        }
    };

    const getDateDisplay = (event) => {
        const start = event.date || event.startDate || event.eventDate;
        const end = event.endDate;
        if (!start) return "TBA";
        const startStr = formatDate(start);
        if (end && end !== start) {
            return `${startStr} & ${formatDate(end)}`;
        }
        return startStr;
    };

    const getTimeDisplay = (event) => {
        const start = event.startTime || event.time;
        const end = event.endTime;
        if (!start) return "TBA";
        if (end) return `${start} - ${end}`;
        return start;
    };

    const getVenueDisplay = (event) => {
        return event.venue || event.location || event.room?.name || event.room || null;
    };

    if (loading) {
        return (
            <AppBackgroundStudents>
                <View style={[styles.container, { justifyContent: "center", alignItems: "center", flex: 1 }]}>
                    <ActivityIndicator size="large" color="#C281FF" />
                    <Text style={styles.loadingText}>Loading events...</Text>
                </View>
            </AppBackgroundStudents>
        );
    }

    return (
        <AppBackgroundStudents>
            <View style={styles.container}>
                {/* Header */}
                <Header currentScreen="Events" />

                {/* Section Label */}
                <Text style={styles.sectionLabel}>CAMPUS BUZZ</Text>
                <Text style={styles.pageTitle}>Upcoming Events</Text>

                {/* Event Carousel or Empty State */}
                {events.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="calendar-blank-outline" size={60} color="rgba(255,255,255,0.2)" />
                        <Text style={styles.emptyTitle}>No Upcoming Events</Text>
                        <Text style={styles.emptySubtitle}>Pull down to refresh</Text>
                    </View>
                ) : (
                    <Animated.FlatList
                        data={events}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => String(item._id || item.id)}
                        snapToInterval={CARD_WIDTH + CARD_SPACING}
                        decelerationRate="fast"
                        bounces={false}
                        contentContainerStyle={{
                            paddingHorizontal: SIDE_PADDING,
                            paddingBottom: 20,
                        }}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
                        renderItem={({ item, index }) => (
                            <AnimatedEventCard
                                event={item}
                                index={index}
                                scrollX={scrollX}
                                onRSVP={handleRSVP}
                                registering={registeringId === (item._id || item.id)}
                                getOrganizer={getOrganizer}
                                getDateDisplay={getDateDisplay}
                                getTimeDisplay={getTimeDisplay}
                                getVenueDisplay={getVenueDisplay}
                            />
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#C281FF"
                            />
                        }
                    />
                )}
            </View>
        </AppBackgroundStudents>
    );
}

// ═══════════════════════════════════════════
// Animated Event Card with 3D perspective
// ═══════════════════════════════════════════
function AnimatedEventCard({
    event, index, scrollX, onRSVP, registering,
    getOrganizer, getDateDisplay, getTimeDisplay, getVenueDisplay,
}) {
    const eventId = event._id || event.id;

    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_SPACING),
            index * (CARD_WIDTH + CARD_SPACING),
            (index + 1) * (CARD_WIDTH + CARD_SPACING),
        ];

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.88, 1, 0.88],
            Extrapolation.CLAMP
        );

        const rotateY = interpolate(
            scrollX.value,
            inputRange,
            [8, 0, -8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.6, 1, 0.6],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollX.value,
            inputRange,
            [15, 0, 15],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { perspective: 1200 },
                { scale },
                { rotateY: `${rotateY}deg` },
                { translateY },
            ],
            opacity,
        };
    });

    const venue = getVenueDisplay(event);

    return (
        <Animated.View style={[styles.cardOuter, animatedStyle]}>
            <View style={styles.eventCard}>
                {/* Event Image */}
                <View style={styles.eventImageContainer}>
                    {event.image || event.imageUrl || event.banner || event.coverImage ? (
                        <Image
                            source={{ uri: event.image || event.imageUrl || event.banner || event.coverImage }}
                            style={styles.eventImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <LinearGradient
                            colors={["#1a0540", "#2E0870", "#4A0DA8"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.eventImagePlaceholder}
                        >
                            <MaterialCommunityIcons name="calendar-star" size={44} color="rgba(255,255,255,0.25)" />
                        </LinearGradient>
                    )}
                </View>

                {/* Event Content */}
                <View style={styles.eventContent}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                        {event.title || event.name || "Untitled Event"}
                    </Text>

                    <Text style={styles.eventOrganizer}>
                        BY {getOrganizer(event)}
                    </Text>

                    <Text style={styles.eventDescription} numberOfLines={3}>
                        {event.description || "No description available."}
                    </Text>

                    {/* Meta Info */}
                    <View style={styles.metaSection}>
                        <View style={styles.metaRow}>
                            {/* Date */}
                            <View style={styles.metaItem}>
                                <View style={styles.metaIconCircle}>
                                    <Feather name="calendar" size={12} color="#C281FF" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>DATE</Text>
                                    <Text style={styles.metaValue}>{getDateDisplay(event)}</Text>
                                </View>
                            </View>

                            {/* Time */}
                            <View style={styles.metaItem}>
                                <View style={styles.metaIconCircle}>
                                    <Feather name="clock" size={12} color="#C281FF" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>TIME</Text>
                                    <Text style={styles.metaValue}>{getTimeDisplay(event)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Venue */}
                        {venue && (
                            <View style={styles.metaItem}>
                                <View style={styles.metaIconCircle}>
                                    <Ionicons name="location-outline" size={13} color="#C281FF" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>VENUE</Text>
                                    <Text style={styles.metaValue}>{venue}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* RSVP Button */}
                    <TouchableOpacity
                        onPress={() => onRSVP(eventId)}
                        activeOpacity={0.8}
                        disabled={registering || event.registered}
                        style={styles.rsvpWrapper}
                    >
                        <LinearGradient
                            colors={event.registered
                                ? ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
                                : ["#C281FF", "#5623CD"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.rsvpButton}
                        >
                            {registering ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.rsvpText}>
                                    {event.registered ? "REGISTERED ✓" : "RSVP NOW"}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "transparent",
    },

    loadingText: {
        color: "rgba(255,255,255,0.5)",
        marginTop: 12,
        fontSize: 14,
    },

    sectionLabel: {
        color: "#00D4AA",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 2,
        marginBottom: 6,
        paddingHorizontal: 22,
    },

    pageTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 20,
        paddingHorizontal: 22,
    },

    // ─── Empty State ───
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 80,
    },
    emptyTitle: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
    },
    emptySubtitle: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 14,
        marginTop: 6,
    },

    // ─── Card Container ───
    cardOuter: {
        width: CARD_WIDTH,
    },

    eventCard: {
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
    },

    // ─── Image ───
    eventImageContainer: {
        width: "100%",
        height: 170,
        overflow: "hidden",
    },

    eventImage: {
        width: "100%",
        height: "100%",
    },

    eventImagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    // ─── Content ───
    eventContent: {
        padding: 18,
    },

    eventTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 3,
    },

    eventOrganizer: {
        color: "#00D4AA",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: 10,
    },

    eventDescription: {
        color: "rgba(255,255,255,0.55)",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 14,
    },

    // ─── Meta ───
    metaSection: {
        marginBottom: 16,
    },

    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },

    metaIconCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "rgba(194,129,255,0.12)",
        justifyContent: "center",
        alignItems: "center",
    },

    metaLabel: {
        color: "rgba(255,255,255,0.35)",
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 1,
    },

    metaValue: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    // ─── RSVP ───
    rsvpWrapper: {
        alignItems: "center",
    },

    rsvpButton: {
        paddingVertical: 12,
        paddingHorizontal: 34,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 140,
    },

    rsvpText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 1.5,
    },
});