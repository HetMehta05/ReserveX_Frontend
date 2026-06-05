import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import { getUserProfile, updateUserProfile } from "../../services/api";

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setFetching(true);
            const data = await getUserProfile(user?.id);
            if (data) {
                setName(data.name || "");
                setPhone(data.phone || "");
            }
        } catch (error) {
            console.log("Error fetching profile:", error);
            Alert.alert("Error", "Could not fetch profile details");
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Validation Error", "Name cannot be empty.");
            return;
        }

        try {
            setLoading(true);
            const updates = { name: name.trim() };
            if (phone.trim()) {
                updates.phone = phone.trim();
            }

            const updatedData = await updateUserProfile(user?.id, updates);

            // Update global user state
            setUser({
                ...user,
                name: updatedData?.user?.name || updates.name,
            });

            Alert.alert("Success", "Profile updated successfully");
            navigation.goBack();
        } catch (error) {
            console.log("Update profile error:", error);
            Alert.alert("Update Failed", "Could not update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppBackgroundStudents>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Header currentScreen="Edit Profile" />
                
                <ScrollView 
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
                >
                    {fetching ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color="#C281FF" />
                            <Text style={styles.loadingText}>Loading details...</Text>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>FULL NAME</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="user" size={20} color="#A0A3BD" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Enter your full name"
                                        placeholderTextColor="#A0A3BD"
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>PHONE NUMBER (OPTIONAL)</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="phone" size={20} color="#A0A3BD" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#A0A3BD"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View style={styles.infoBox}>
                                <Feather name="info" size={16} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.infoText}>
                                    Other details like Department, Roll Number, and Email are managed by the institution and cannot be changed here.
                                </Text>
                            </View>

                            <TouchableOpacity 
                                style={styles.saveButton} 
                                onPress={handleSave}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </AppBackgroundStudents>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
    },
    loadingText: {
        color: "rgba(255,255,255,0.4)",
        marginTop: 12,
        fontSize: 14,
    },
    formContainer: {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: "#00D4AA",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
    },
    infoBox: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.02)",
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 24,
        alignItems: "flex-start",
    },
    infoText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 13,
        marginLeft: 12,
        lineHeight: 20,
        flex: 1,
    },
    saveButton: {
        backgroundColor: "#C281FF",
        borderRadius: 16,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#C281FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1,
    },
});
