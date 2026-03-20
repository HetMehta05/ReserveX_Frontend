import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CommitteeBackground from "../../layouts/AppBackgroundCommittee";

export default function CommitteeNewsScreen() {
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
                    {/* Toggle/Tabs Container */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity style={styles.tabButton}>
                            <LinearGradient colors={['#E0E0E0', '#BDBDBD']} style={styles.tabGradient}>
                                <Text style={styles.tabText}>Comps</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabButton}>
                            <LinearGradient colors={['#E0E0E0', '#BDBDBD']} style={styles.tabGradient}>
                                <Text style={styles.tabText}>Tech Event</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabButton}>
                            <LinearGradient colors={['#E0E0E0', '#BDBDBD']} style={styles.tabGradient}>
                                <Text style={styles.tabText}>Any Occupancy</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Empty space below for the rest of the layout */}
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
        marginBottom: 40
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
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent dark background
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)', // Outline
        borderRadius: 30,
        padding: 6
    },
    tabButton: {
        flex: 1,
        marginHorizontal: 8
    },
    tabGradient: {
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow for text depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    tabText: {
        fontSize: 10,
        fontFamily: 'DMMono-Regular',
        color: '#1a1a1a',
        fontWeight: '700',
        textAlign: 'center'
    },
    bottomSpace: {
        height: 100
    }
});