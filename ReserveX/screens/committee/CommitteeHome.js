import React from 'react';
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

const HomeScreen = () => {
    return (
        <AppBackgroundCommittee>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>ReserveX</Text>
                    <View style={styles.headerIcons}>
                        <Ionicons name="notifications-outline" size={22} color="#fff" />
                        <Ionicons name="person-outline" size={22} color="#fff" style={{ marginLeft: 15 }} />
                    </View>
                </View>

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

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3, 4, 5].map((item) => (
                        <View key={item} style={styles.glassCard} />
                    ))}
                </ScrollView>

            </ScrollView>
        </AppBackgroundCommittee>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 100,
        marginTop: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    logo: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
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
        width: 120,
        height: 150,
        borderRadius: 20,
        marginRight: 15,
        marginTop: 15,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
});