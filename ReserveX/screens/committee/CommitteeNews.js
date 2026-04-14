import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import CommitteeBackground from "../../layouts/AppBackgroundCommittee";

export default function CommitteeNewsScreen() {
    const navigation = useNavigation();

    const [activeTab, setActiveTab] = useState("Any");

    const tabs = ["Comps", "Tech Event", "Any"];

    // ✅ Dummy News Data
    const newsData = [
        {
            id: 1,
            title: "Coding Competition Announced",
            desc: "Registrations open for AlgoRush 2026.",
            type: "Comps",
            time: "2 hr ago"
        },
        {
            id: 2,
            title: "AI Workshop Coming",
            desc: "Hands-on session on ML basics.",
            type: "Tech Event",
            time: "5 hr ago"
        },
        {
            id: 3,
            title: "Hackathon Winners",
            desc: "Team Alpha secured 1st place.",
            type: "Comps",
            time: "1 day ago"
        },
        {
            id: 4,
            title: "Cloud Seminar",
            desc: "AWS experts visiting campus.",
            type: "Tech Event",
            time: "2 days ago"
        }
    ];

    // ✅ Filter logic
    const filteredNews =
        activeTab === "Any"
            ? newsData
            : newsData.filter(item => item.type === activeTab);

    return (
        <CommitteeBackground>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>ReserveX</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("CommitteeNotification")}>
                            <Ionicons name="notifications" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="person" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        {tabs.map((tab, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.tabButton}
                                onPress={() => setActiveTab(tab)}
                            >
                                <LinearGradient
                                    colors={
                                        activeTab === tab
                                            ? ['#ffffff', '#dcdcdc']
                                            : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']
                                    }
                                    style={styles.tabGradient}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        activeTab === tab && { color: "#000" }
                                    ]}>
                                        {tab}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* News List */}
                    <View style={styles.newsList}>
                        {filteredNews.map((item) => (
                            <View key={item.id} style={styles.newsCard}>

                                <Text style={styles.newsTitle}>{item.title}</Text>

                                <Text style={styles.newsDesc}>{item.desc}</Text>

                                <Text style={styles.newsTime}>{item.time}</Text>

                            </View>
                        ))}
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

    scrollContent: {
        paddingHorizontal: 20
    },

    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 30,
        padding: 6,
        marginBottom: 30
    },

    tabButton: {
        flex: 1,
        marginHorizontal: 5
    },

    tabGradient: {
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center'
    },

    tabText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '600'
    },

    newsList: {
        gap: 15
    },

    newsCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },

    newsTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600'
    },

    newsDesc: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 5
    },

    newsTime: {
        color: '#888',
        fontSize: 11,
        marginTop: 10,
        textAlign: 'right'
    },

    bottomSpace: {
        height: 100
    }
});