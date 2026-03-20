import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommitteeBackground from "../../layouts/AppBackgroundCommittee";

export default function CommitteeHomeScreen() {
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
                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="search for anything..."
                            placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                        <Ionicons name="search-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
                    </View>

                    {/* Upcoming Events */}
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalScrollContent}>
                        <View style={styles.eventCard} />
                        <View style={styles.eventCard} />
                        <View style={styles.eventCard} />
                    </ScrollView>

                    {/* Todays Highlights */}
                    <Text style={[styles.sectionTitle, styles.rightAlignTitle]}>Todays Highlights</Text>
                    <View style={styles.highlightCard} />

                    {/* Empty space at bottom to allow scrolling smoothly above the tab bar */}
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
        fontFamily: 'Times New Roman',
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
        fontFamily: 'DMMono-Regular',
        marginRight: 10
    },
    searchIcon: {
        opacity: 0.8
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'DMMono-Regular',
        marginBottom: 20,
        letterSpacing: 0.5
    },
    rightAlignTitle: {
        textAlign: 'right',
        marginTop: 40
    },
    horizontalScroll: {
        marginRight: -20, // To allow scrolling off-screen edge elegantly
    },
    horizontalScrollContent: {
        paddingRight: 20
    },
    eventCard: {
        width: 140,
        height: 220,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    highlightCard: {
        width: '100%',
        height: 240,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    bottomSpace: {
        height: 80
    }
});