import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";

export default function TimeTableScreen() {
    const [selectedDate, setSelectedDate] = useState("Monday, 2nd Feb");

    const dates = [
        "Monday, 2nd Feb",
        "Tuesday, 3rd Feb",
        "Wednesday, 4th Feb",
        "Thursday, 5th Feb",
        "Friday, 6th Feb",
        "Saturday, 7th Feb",
        "Sunday, 8th Feb"
    ];

    const schedule = [
        { time: "8:00 am", title: "Open Elective - Digital Marketing Management", room: "Classroom 51" },
        { time: "9:00 am", title: "Open Elective - Digital Marketing Management", room: "Classroom 51" },
        { time: "10:00 am", title: "Break", room: null },
        { time: "11:00 am", title: "Artificial Intelligence", room: "Classroom 63" },
        { time: "12:00 pm", title: "Operating Systems", room: "Classroom 63" },
        { time: "1:00 pm", title: "Operating Systems", room: "Classroom 63" },
        { time: "2:00 pm", title: "Honours - Visualisation in Data Science", room: "Classroom 62" },
        { time: "3:00 pm", title: "Honours - Visualisation in Data Science", room: "Classroom 62" }
    ];

    return (
        <AppBackgroundStudents>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Header currentScreen="TimeTable" />

                {/* Dates filter section */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        {dates.map((date, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.filterPill,
                                    selectedDate === date && styles.filterPillSelected
                                ]}
                                onPress={() => setSelectedDate(date)}
                            >
                                <Text style={styles.filterText}>{date}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Timetable container */}
                <View style={styles.timetableContainer}>
                    <View style={styles.timelineVerticalLine} />

                    {schedule.map((item, index) => (
                        <View key={index} style={styles.timelineRow}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>
                            <View style={styles.contentColumn}>
                                <Text style={styles.titleText}>{item.title}</Text>
                                {item.room && <Text style={styles.roomText}>{item.room}</Text>}
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </AppBackgroundStudents>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 22, backgroundColor: "transparent" },
    filterContainer: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 20,
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 30,
    },
    filterScroll: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5
    },
    filterPill: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 15,
        backgroundColor: "rgba(255,255,255,0.8)",
        marginHorizontal: 5,
        alignItems: 'center'
    },
    filterPillSelected: {
        backgroundColor: "rgba(255,255,255,0.95)",
    },
    filterText: {
        color: "#000",
        fontSize: 10,
        fontWeight: "600",
        fontFamily: "monospace"
    },
    timetableContainer: {
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 30,
        paddingRight: 10,
        position: 'relative'
    },
    timelineVerticalLine: {
        position: 'absolute',
        left: 80,
        top: 20,
        bottom: 20,
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    timelineRow: {
        flexDirection: "row",
        marginBottom: 35,
    },
    timeColumn: {
        width: 80,
        alignItems: "flex-end",
        paddingRight: 15,
    },
    timeText: {
        color: "#fff",
        fontSize: 11,
        fontFamily: "monospace",
        marginTop: 2
    },
    contentColumn: {
        flex: 1,
        paddingLeft: 15,
    },
    titleText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "500",
        fontFamily: "monospace",
        marginBottom: 6,
        paddingRight: 10,
        lineHeight: 16
    },
    roomText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 9,
        fontFamily: "monospace"
    }
});