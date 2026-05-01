import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";

import CommitteeBackground from "../../layouts/AppBackgroundCommittee";
import Header from "../../components/Header";
import { getAllEvents } from "../../services/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.82;
const CARD_SPACING = 16;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;

export default function CommitteeHomeScreen() {
    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollX = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const loadEvents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllEvents();
            setEvents(Array.isArray(data) ? data : data.events || []);
        } catch (error) {
            console.log("Error loading home events:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    // Format today's date like "WEDNESDAY, APRIL 8"
    const today = new Date();
    const dateString = today.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

    const liveMeeting = {
        title: "Creatives Meeting",
        time: "11:00 - 12:00",
        location: "Classroom 63"
    };

    const nextEvent = events.length > 0 ? events[0] : null;
    const upcomingEvents = events.length > 1 ? events.slice(1) : [];

    return (
        <CommitteeBackground>
            <View style={styles.container}>

                {/* Header */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Header />
                </View>

                {/* Search */}
                <View style={styles.searchWrapper}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="search for anything..."
                            placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                        <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.7)" />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Branding / Date */}
                    <Text style={styles.dateText}>{dateString}</Text>
                    <Text style={styles.mainTitle}>DJS Unicode</Text>

                    {/* LIVE MEETING CARD */}
                    <View style={styles.liveMeetingCard}>
                        <View style={styles.liveHeaderRow}>
                            <Text style={styles.cardHeaderSmall}>COMMITTEE MEETING</Text>
                            <View style={styles.liveBadge}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveBadgeText}>LIVE NOW</Text>
                            </View>
                        </View>
                        
                        <Text style={styles.meetingTitle}>{liveMeeting.title}</Text>

                        <View style={styles.meetingInfoRow}>
                            <View style={styles.meetingMeta}>
                                <Ionicons name="time-outline" size={20} color="#67DCE6" style={styles.metaIcon} />
                                <View>
                                    <Text style={styles.metaLabel}>TIME</Text>
                                    <Text style={styles.metaValue}>{liveMeeting.time}</Text>
                                </View>
                            </View>

                            <View style={styles.meetingMeta}>
                                <Ionicons name="location-outline" size={20} color="#67DCE6" style={styles.metaIcon} />
                                <View>
                                    <Text style={styles.metaLabel}>LOCATION</Text>
                                    <Text style={styles.metaValue}>{liveMeeting.location}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* NEXT EVENT CARD */}
                    {nextEvent && (
                        <View style={styles.nextEventCard}>
                            <Text style={styles.cardHeaderSmall}>NEXT EVENT</Text>
                            <Text style={styles.meetingTitle}>{nextEvent.title || nextEvent.name}</Text>
                            
                            <View style={styles.nextEventRow}>
                                <View>
                                    <Text style={styles.metaLabel}>DATE</Text>
                                    <Text style={styles.nextEventValue}>{nextEvent.date || "TBA"}</Text>
                                </View>
                                
                                <TouchableOpacity 
                                    style={styles.nextEventArrow}
                                    onPress={() => navigation.navigate("Events")}
                                >
                                    <Ionicons name="arrow-forward" size={22} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* UPCOMING EVENTS ROW */}
                    <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Upcoming Events</Text>

                    {loading ? (
                        <ActivityIndicator color="#67DCE6" style={{ marginTop: 20 }} />
                    ) : (
                        <Animated.FlatList
                            data={upcomingEvents}
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
                                />
                            )}
                        />
                    )}

                    <View style={styles.bottomSpace} />
                </ScrollView>
            </View>
        </CommitteeBackground>
    );
}

// ═══════════════════════════════════════════
// Animated Event Card with 3D perspective
// ═══════════════════════════════════════════
function AnimatedEventCard({ event, index, scrollX }) {
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

    const getOrganizer = (event) => {
        const org = event.organizer || event.club || event.committee || "ORGANIZER";
        return typeof org === "string" ? org.toUpperCase() : (org.name || "ORGANIZER").toUpperCase();
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
        const start = event.date || event.startDate;
        const end = event.endDate;
        if (!start) return "TBA";
        return end && end !== start ? `${formatDate(start)} & ${formatDate(end)}` : formatDate(start);
    };

    return (
        <Animated.View style={[styles.cardOuter, animatedStyle]}>
            <View style={styles.animEventCard}>
                <View style={styles.animEventImageContainer}>
                    {event.image || event.imageUrl || event.banner || event.coverImage ? (
                        <Image source={{ uri: event.image || event.imageUrl || event.banner || event.coverImage }} style={styles.animEventImage} resizeMode="cover" />
                    ) : (
                        <LinearGradient colors={["#100c2e", "#251b5c", "#37248f"]} style={styles.animEventImagePlaceholder}>
                            <MaterialCommunityIcons name="calendar-star" size={44} color="rgba(255,255,255,0.25)" />
                        </LinearGradient>
                    )}
                </View>

                <View style={styles.animEventContent}>
                    <Text style={styles.animEventTitle} numberOfLines={1}>{event.title || event.name || "Untitled Event"}</Text>
                    <Text style={styles.animEventOrganizer}>BY {getOrganizer(event)}</Text>
                    
                    <View style={styles.animMetaRow}>
                        <View style={styles.animMetaItem}>
                            <Feather name="calendar" size={13} color="#67DCE6" />
                            <Text style={styles.animMetaValue}>{getDateDisplay(event)}</Text>
                        </View>
                        <View style={styles.animMetaItem}>
                            <Feather name="clock" size={13} color="#67DCE6" />
                            <Text style={styles.animMetaValue}>{event.time || event.startTime || "TBA"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },

    // Header code removed because we use the global <Header />

    scrollContent: {
        paddingHorizontal: 20
    },

    searchWrapper: {
        paddingHorizontal: 20,
        marginBottom: 20
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(53, 94, 99, 0.8)',
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },

    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        marginRight: 10
    },
    
    dateText: {
        color: '#d0d0d0',
        fontSize: 12,
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    
    mainTitle: {
        color: '#67DCE6',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    
    cardHeaderSmall: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        letterSpacing: 1.5,
        marginBottom: 8,
    },

    liveMeetingCard: {
        backgroundColor: '#1E123B', // deep purple card
        borderRadius: 22,
        padding: 24,
        marginBottom: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)'
    },
    
    liveHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF4747',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 10,
    },
    
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF4747',
        marginRight: 6
    },
    
    liveBadgeText: {
        color: '#FF4747',
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    
    meetingTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    
    meetingInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    
    meetingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    metaIcon: {
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 8,
        borderRadius: 20,
    },
    
    metaLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 2,
    },
    
    metaValue: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600'
    },
    
    nextEventCard: {
        backgroundColor: '#1C152F',
        borderRadius: 22,
        padding: 24,
        marginBottom: 35,
        elevation: 3,
    },
    
    nextEventRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    
    nextEventValue: {
        color: '#67DCE6',
        fontSize: 16,
        fontWeight: '500'
    },
    
    nextEventArrow: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        letterSpacing: 0.5
    },

    horizontalScrollContent: {
        paddingRight: 20,
        gap: 15,
    },

    cardOuter: {
        width: CARD_WIDTH,
    },

    animEventCard: {
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
        overflow: "hidden",
    },

    animEventImageContainer: {
        width: "100%",
        height: 150,
        overflow: "hidden",
    },

    animEventImage: {
        width: "100%",
        height: "100%",
    },

    animEventImagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    animEventContent: {
        padding: 18,
    },

    animEventTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4,
    },

    animEventOrganizer: {
        color: "#67DCE6",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 12,
    },

    animMetaRow: {
        flexDirection: "row",
        gap: 15,
    },

    animMetaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    animMetaValue: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    bottomSpace: {
        height: 100
    }
});