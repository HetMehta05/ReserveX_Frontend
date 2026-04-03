import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import AppBackgroundCommittee from "../../../layouts/AppBackgroundCommittee";

export default function CreateEventScreen() {
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const navigation = useNavigation();

    return (
        <AppBackgroundCommittee >
            <View style={styles.container}>

                {/* Header */}
                <Header currentScreen="Create" />

                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* EVENT NAME */}
                    <Text style={styles.label}>Event Name</Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={eventName}
                            onChangeText={setEventName}
                            style={styles.input}
                            placeholder=""
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    {/* DESCRIPTION */}
                    <Text style={[styles.label, { textAlign: "right" }]}>
                        Description
                    </Text>
                    <View style={[styles.inputBox, styles.descBox]}>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, { textAlignVertical: "top" }]}
                            multiline
                        />
                    </View>

                    {/* TAGS */}
                    <Text style={styles.label}>Tags</Text>
                    <View style={[styles.inputBox, { justifyContent: "center" }]}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Tech</Text>
                        </View>
                    </View>



                </ScrollView>

                <TouchableOpacity style={styles.createBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.createBtnText}>Create Event</Text>
                </TouchableOpacity>

            </View >
        </AppBackgroundCommittee >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 60,
    },

    /* LABELS */
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
        letterSpacing: 1,
    },

    /* INPUT BOX (IMPORTANT — NOT TRANSPARENT) */
    inputBox: {
        height: 55,
        borderRadius: 14,
        paddingHorizontal: 15,


        // 🔥 SOLID TINT (not transparent)
        backgroundColor: "#0f3f459b",

        marginBottom: 30,
    },

    /* DESCRIPTION BOX */
    descBox: {
        height: 140,
        paddingTop: 12,
    },

    input: {
        color: "#fff",
        fontSize: 14,
    },

    /* TAG */
    tag: {
        backgroundColor: "#00c9a7",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
    },

    tagText: {
        color: "#000",
        fontSize: 12,
        fontWeight: "600",
    },

    createBtn: {
        backgroundColor: "#00c9a7",
        height: 55,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",

        position: "absolute",
        bottom: 20,
        left: 22,
        right: 22,
    },

    createBtnText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
    },
});