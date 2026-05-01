import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AppBackgroundStudent from "../../layouts/AppBackgroundStudents";
import { useUser } from "../../context/UserContext";
import AppBackgroundCommittee from '../../layouts/AppBackgroundCommittee';

export default function LoginScreen() {
    const { setUser, setToken } = useUser();
    const { setUserId } = useUser();
    const [activeTab, setActiveTab] = useState('login');
    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleAuth = async () => {
        if (loading) return;

        if (!form.username || !form.password || (activeTab === 'signup' && !form.name)) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill all required fields',
            });
            return;
        }

        try {
            setLoading(true);

            const endpoint = activeTab === 'signup' ? '/auth/register' : '/auth/login';
            const body = activeTab === 'signup' 
                ? { name: form.name.trim(), email: form.username.trim(), password: form.password, role: 'COMMITTEE' }
                : { email: form.username.trim(), password: form.password };

            const response = await fetch(`https://reservex.onrender.com/api${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `${activeTab === 'signup' ? 'Signup' : 'Login'} failed`);
            }

            if (activeTab === 'signup') {
                Toast.show({
                    type: 'success',
                    text1: 'Account Created',
                    text2: 'Please login now.',
                });
                setActiveTab('login');
            } else {
                await AsyncStorage.setItem('accessToken', data.accessToken);

                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: 'Welcome back!',
                });

                setUser({
                    ...data.user,
                    role: "committee"
                });
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: `${activeTab === 'signup' ? 'Signup' : 'Login'} Failed`,
                text2: err.message,
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#000' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
            >
                <AppBackgroundCommittee>
                    <View style={styles.container}>
                        {/* Logo */}
                        <Text style={styles.logo}>ReserveX</Text>

                        {/* Image */}
                        <Image
                            source={require('../../assets/loginPage_img.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />

                        {/* Glass Card */}
                        <BlurView intensity={40} tint="dark" style={styles.glassCard}>

                            {/* Toggle */}
                            <View style={styles.toggleContainer}>

                                {/* LOGIN TAB */}
                                <TouchableOpacity
                                    style={styles.toggleWrapper}
                                    onPress={() => setActiveTab('login')}
                                    activeOpacity={0.8}
                                >
                                    {activeTab === 'login' ? (
                                        <LinearGradient
                                            colors={['#C281FF', '#5623CD']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            style={styles.activeToggle}
                                        >
                                            <Text style={[styles.toggleText, { color: '#fff' }]}>
                                                Login
                                            </Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={styles.inactiveToggle}>
                                            <Text style={[styles.toggleText, { color: '#000' }]}>
                                                Login
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                {/* SIGNUP TAB */}
                                <TouchableOpacity
                                    style={styles.toggleWrapper}
                                    onPress={() => setActiveTab('signup')}
                                    activeOpacity={0.8}
                                >
                                    {activeTab === 'signup' ? (
                                        <LinearGradient
                                            colors={['#C281FF', '#5623CD']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            style={styles.activeToggle}
                                        >
                                            <Text style={[styles.toggleText, { color: '#fff' }]}>
                                                Signup
                                            </Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={styles.inactiveToggle}>
                                            <Text style={[styles.toggleText, { color: '#000' }]}>
                                                Signup
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Inputs */}
                            {activeTab === 'signup' && (
                                <TextInput
                                    placeholder="Name"
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    style={styles.input}
                                    value={form.name}
                                    onChangeText={(text) =>
                                        setForm(prev => ({ ...prev, name: text }))
                                    }
                                />
                            )}
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                style={styles.input}
                                value={form.username}
                                onChangeText={(text) =>
                                    setForm(prev => ({ ...prev, username: text }))
                                }
                            />

                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Password"
                                    value={form.password}
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    secureTextEntry={!showPassword}
                                    style={styles.passwordInput}
                                    autoCorrect={false}
                                    keyboardType="default"
                                    onChangeText={(text) =>
                                        setForm({ ...form, password: text })
                                    }
                                />

                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#ffffff"
                                    />
                                </TouchableOpacity>
                            </View>


                            {/* Auth Button */}
                            <TouchableOpacity
                                style={{ marginTop: 25 }}
                                activeOpacity={0.8}
                                onPress={handleAuth}
                                disabled={loading}>

                                <LinearGradient
                                    colors={['#C281FF', '#5623CD']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={styles.loginButton}
                                >
                                    <Text style={styles.loginText}>
                                        {loading ? 'Wait...' : (activeTab === 'signup' ? 'Signup' : 'Login')}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </BlurView>
                    </View>
                </AppBackgroundCommittee>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'center',
    },

    logo: {
        fontSize: 15,
        fontFamily: 'Times New Roman',
        marginBottom: 50,
        color: '#fff',
    },

    image: {
        width: 294,
        height: 294,
        marginBottom: 30,
        alignSelf: 'center',
    },

    glassCard: {
        borderRadius: 30,              // smoother corners
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',            // 🔥 fixes sharp edge bleed
    },

    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 30,              // fully rounded
        marginBottom: 25,
        padding: 3,
    },

    toggleWrapper: {
        flex: 1,
    },

    activeToggle: {
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
    },

    inactiveToggle: {
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
    },

    toggleText: {
        fontFamily: 'DMMono-Regular',
        fontSize: 16
    },

    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        paddingVertical: 12,
        color: '#fff',
        marginBottom: 20,
        fontFamily: 'DMMono-Regular',
    },

    loginButton: {
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        alignSelf: 'center',
    },

    loginText: {
        color: '#fff',
        fontFamily: 'DMMono-Regular',
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        color: '#fff',
        fontFamily: 'DMMono-Regular',
    },

    eyeIcon: {
        paddingLeft: 10,
    },
});