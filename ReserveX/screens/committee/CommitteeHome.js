import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommitteeBackground from "../../layouts/AppBackgroundCommittee";

export default function CommitteeHomeScreen() {

    // ✅ Dummy Events
    const events = [
        {
            id: 1,
            title: "Tech Talk",
            room: "A101",
            date: "Today, 2 PM"
        },
        {
            id: 2,
            title: "AI Workshop",
            room: "B202",
            date: "Tomorrow, 11 AM"
        },
        {
            id: 3,
            title: "Hackathon",
            room: "Main Hall",
            date: "25 Mar, 9 AM"
        }
    ];

    // ✅ Dummy Highlight
    const highlight = {
        title: "Big Event Coming 🚀",
        description: "Annual Tech Fest registrations are now open. Book rooms early and manage schedules efficiently.",
    };

    return (
        <CommitteeBackground>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>ReserveX</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="notifications" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="person" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="search for anything..."
                            placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                        <Ionicons name="search-outline" size={20} color="rgba(255,255,255,0.7)" />
                    </View>

                    {/* EVENTS */}
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScrollContent}
                    >
                        {events.map((event) => (
                            <View key={event.id} style={styles.eventCard}>

                                {/* Title */}
                                <Text style={styles.eventTitle}>{event.title}</Text>

                                {/* Empty space for poster */}
                                <View style={styles.posterSpace} />

                                {/* Bottom Info */}
                                <View style={styles.eventFooter}>
                                    <Text style={styles.eventRoom}>Room {event.room}</Text>
                                    <Text style={styles.eventDate}>{event.date}</Text>
                                </View>

                            </View>
                        ))}
                    </ScrollView>

                    {/* HIGHLIGHTS */}
                    <Text style={[styles.sectionTitle, styles.rightAlignTitle]}>
                        Todays Highlights
                    </Text>

                    <View style={styles.highlightCard}>
                        <Text style={styles.highlightTitle}>{highlight.title}</Text>
                        <Text style={styles.highlightDesc}>{highlight.description}</Text>
                    </View>

                    <View style={styles.bottomSpace} />

                </ScrollView>
            </View>
        </CommitteeBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30
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

    scrollContent: {
        paddingHorizontal: 20
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        marginBottom: 35
    },

    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        marginRight: 10
    },

    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 20,
        letterSpacing: 0.5
    },

    rightAlignTitle: {
        textAlign: 'right',
        marginTop: 40
    },

    horizontalScrollContent: {
        paddingRight: 20
    },

    eventCard: {
        width: 150,
        height: 220,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        justifyContent: 'space-between'
    },

    eventTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },

    posterSpace: {
        flex: 1,
    },

    eventFooter: {
        alignItems: "center",
    },

    eventRoom: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
    },

    eventDate: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 2,
    },

    highlightCard: {
        width: '100%',
        height: 240,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        justifyContent: 'center'
    },

    highlightTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },

    highlightDesc: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 20
    },

    bottomSpace: {
        height: 80
    }
});