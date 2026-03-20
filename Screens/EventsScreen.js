import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.65;
const SPACING = 25;
const SIDE_SPACE = (width - CARD_WIDTH) / 2;

const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

// Dummy event data for testing
const DUMMY_EVENTS = [
    { id: 1, title: "Hackathon Night" },
    { id: 2, title: "AI Conference" },
    { id: 3, title: "Startup Meetup" },
    { id: 4, title: "Design Summit" },
];

function EventCard({ item, index, scrollX }) {
    const animatedStyle = useAnimatedStyle(() => {
        const position = scrollX.value / (CARD_WIDTH + SPACING);

        const rotateY = interpolate(
            position,
            [index - 1, index, index + 1],
            [60, 0, -60],
            Extrapolate.CLAMP
        );

        const scale = interpolate(
            position,
            [index - 1, index, index + 1],
            [0.85, 1, 0.85],
            Extrapolate.CLAMP
        );

        const translateX = interpolate(
            position,
            [index - 1, index, index + 1],
            [-40, 0, 40],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { perspective: 1200 },
                { translateX },
                { rotateY: `${rotateY}deg` },
                { scale },
            ],
        };
    });

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
        </Animated.View>
    );
}

export default function EventsScreen() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollX = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    useEffect(() => {
        // Commented out API fetch for now
        /*
        const fetchEvents = async () => {
            try {
                const response = await fetch("https://reservex.onrender.com/api/events");
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setEvents(data);
                } else {
                    setEvents([]);
                    Toast.show({
                        type: 'info',
                        text1: 'No events available right now.',
                        position: 'top',
                        visibilityTime: 3000,
                    });
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                Toast.show({
                    type: 'error',
                    text1: 'Unable to fetch events.',
                    position: 'top',
                    visibilityTime: 3000,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
        */

        // Use dummy data for testing design
        setEvents(DUMMY_EVENTS);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>ReserveX</Text>
                <View style={styles.iconContainer}>
                    <Ionicons name="notifications-outline" size={22} color="white" />
                    <Ionicons name="person-outline" size={22} color="white" />
                </View>
            </View>

            {/* Centered Carousel */}
            <View style={styles.carouselContainer}>
                <AnimatedFlatList
                    data={events}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    snapToInterval={CARD_WIDTH + SPACING}
                    decelerationRate="fast"
                    bounces={false}
                    contentContainerStyle={{
                        paddingHorizontal: SIDE_SPACE,
                        alignItems: "center",
                    }}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    renderItem={({ item, index }) => (
                        <EventCard item={item} index={index} scrollX={scrollX} />
                    )}
                    ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },

    header: {
        marginTop: 60,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },

    iconContainer: {
        flexDirection: "row",
        gap: 18,
    },

    carouselContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
    },

    card: {
        width: CARD_WIDTH,
        aspectRatio: 254 / 395,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
    },

    cardTitle: {
        color: "white",
        fontSize: 22,
        fontWeight: "600",
    },
});