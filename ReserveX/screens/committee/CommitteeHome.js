import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppBackgroundCommittee from '../../layouts/AppBackgroundCommittee';
import Header from '../../components/Header';
import { getAllEvents } from '../../services/api';
import { ActivityIndicator, Image } from 'react-native';

const HomeScreen = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getAllEvents();
                setEvents(Array.isArray(data) ? data : data.events || []);
            } catch (error) {
                console.log("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    return (
        <AppBackgroundCommittee>
            <ScrollView contentContainerStyle={styles.container}>

                <Header />

                {/* Search */}
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder="Search for anything..."
                        placeholderTextColor="#ccc"
                        style={styles.input}
                    />
                    <Ionicons name="search" size={18} color="#ccc" />
                </View>

                {/* Date */}
                <Text style={styles.date}>WEDNESDAY, APRIL 8</Text>

                {/* Highlight Title */}
                <Text style={styles.title}>DJS Unicode</Text>

                {/* Creative Meeting Card */}
                <View style={styles.card1}>
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveText}>LIVE NOW</Text>
                    </View>

                    <Text style={styles.cardSub}>COMMITTEE MEETING</Text>
                    <Text style={styles.cardTitle}>Creatives Meeting</Text>

                    <View style={styles.row}>
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={25} color="#81ECFF" />
                            <Text style={styles.infoText}>11:00 - 12:00</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Ionicons name="location-outline" size={25} color="#81ECFF" />
                            <Text style={styles.infoText}>Classroom 63</Text>
                        </View>
                    </View>
                </View>

                {/* Next Event */}
                <View style={styles.card2}>
                    <Text style={styles.nextEvent}>NEXT EVENT</Text>
                    <Text style={styles.cardTitle}>Hackprep 7.0</Text>

                    <Text style={styles.dateLabel}>DATE</Text>
                    <Text style={styles.highlight}>20th & 21st April</Text>

                    <TouchableOpacity style={styles.arrowBtn}>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Upcoming */}
                <Text style={styles.upcoming}>Upcoming Events</Text>

                {loading ? (
                    <ActivityIndicator size="small" color="#81ECFF" style={{ marginTop: 20 }} />
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {events.length > 0 ? events.map((event) => (
                            <View key={event._id || event.id} style={styles.glassCard}>
                                {event.imageUrl ? (
                                    <Image source={{ uri: event.imageUrl }} style={styles.glassImage} />
                                ) : (
                                    <View style={styles.glassImagePlaceholder}>
                                        <Ionicons name="calendar" size={24} color="#81ECFF" />
                                    </View>
                                )}
                                <Text style={styles.glassTitle} numberOfLines={1}>{event.title}</Text>
                                <Text style={styles.glassDate} numberOfLines={1}>{event.date || 'TBA'}</Text>
                            </View>
                        )) : (
                            <Text style={{ color: '#ACA8C3', marginTop: 10 }}>No upcoming events.</Text>
                        )}
                    </ScrollView>
                )}

            </ScrollView>
        </AppBackgroundCommittee>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 150,
        marginTop: 30,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 40
    },

    logo: {
        fontSize: 22,
        color: '#E0E0E0',
        fontWeight: 'bold',
        letterSpacing: 1
    },

    headerIcons: {
        flexDirection: 'row'
    },

    iconButton: {
        marginLeft: 15
    },

    headerIcons: {
        flexDirection: 'row',
    },

    searchBar: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },

    input: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
    },

    date: {
        marginTop: 20,
        color: '#ACA8C3',
        fontSize: 12,
        letterSpacing: 1,
    },

    title: {
        fontSize: 28,
        color: '#81ECFF',
        fontWeight: '700',
        marginTop: 5,
    },

    /* CARD 1 */
    card1: {
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#131027',
    },

    liveBadge: {
        position: 'absolute',
        right: 15,
        top: 15,
        backgroundColor: '#FF6B9B',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    liveText: {
        fontSize: 10,
        color: '#fff',
    },

    cardSub: {
        color: '#ACA8C3',
        fontSize: 12,
        marginBottom: 5,
    },

    cardTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },

    row: {
        flexDirection: 'row',
        marginTop: 15,
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },

    infoText: {
        color: '#ACA8C3',
        marginLeft: 5,
        fontSize: 12,
    },

    /* CARD 2 */
    card2: {
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#131027',
        position: 'relative',
    },

    nextEvent: {
        color: '#ACA8C3',
        fontSize: 12,
    },

    dateLabel: {
        color: '#ACA8C3',
        fontSize: 12,
        marginTop: 10,
    },

    highlight: {
        color: '#81ECFF',
        fontSize: 16,
        marginTop: 2,
    },

    arrowBtn: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        backgroundColor: '#48455C',
        borderRadius: 20,
        padding: 10,
    },

    upcoming: {
        marginTop: 25,
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    /* GLASS CARDS */
    glassCard: {
        width: 140,
        height: 160,
        borderRadius: 20,
        marginRight: 15,
        marginTop: 15,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
        paddingBottom: 10,
    },
    glassImage: {
        width: '100%',
        height: 90,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    glassImagePlaceholder: {
        width: '100%',
        height: 90,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    glassTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    glassDate: {
        color: '#81ECFF',
        fontSize: 10,
        marginTop: 4,
        paddingHorizontal: 10,
    },
});