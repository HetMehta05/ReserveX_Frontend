import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import AppBackgroundStudent from "../../layouts/AppBackgroundStudents";
import { useUser } from "../../context/UserContext";
import { useNavigation } from '@react-navigation/native';
import Logo from "../../assets/ReserveX.svg";

export default function LoginScreen({ switchToSignup }) {
    const navigation = useNavigation();
    const { setUser } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (!email.trim() || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Email and password are required',
            });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address',
            });
            return false;
        }

        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must be at least 6 characters',
            });
            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        if (loading) return;
        if (!validateInputs()) return;

        setLoading(true);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            const loginRes = await fetch(
                'https://reservex.onrender.com/api/auth/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            const loginData = await loginRes.json();

            if (!loginRes.ok || !loginData?.accessToken) {
                throw new Error(loginData?.message || 'Login failed');
            }

            const token = loginData.accessToken;

            await AsyncStorage.setItem('accessToken', token);

            const meRes = await fetch(
                'https://reservex.onrender.com/api/auth/me',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const userData = await meRes.json();

            if (!meRes.ok) {
                throw new Error(userData?.message || 'Failed to fetch user');
            }

            setUser({
                id: userData.id,
                email: userData.email,
                role: 'student',
                token,
            });

            Toast.show({
                type: 'success',
                text1: 'Login Successful',
            });

        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2:
                    err.name === 'AbortError'
                        ? 'Request timed out'
                        : err.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppBackgroundStudent>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                extraScrollHeight={20}
            >
                <View style={styles.container}>

                    {/* Logo */}
                    <Logo width={120} height={50} style={styles.logo} />

                    {/* Image */}
                    <Image
                        source={require('../../assets/loginPage_img.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    {/* Card */}
                    <BlurView intensity={40} tint="dark" style={styles.glassCard}>

                        {/* Toggle */}
                        <View style={styles.toggleContainer}>
                            <View style={styles.activeToggle}>
                                <Text style={styles.activeText}>Login</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.inactiveToggle}
                                onPress={switchToSignup}
                            >
                                <Text style={styles.inactiveText}>Signup</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Email */}
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Password */}
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />

                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Button */}
                        <TouchableOpacity
                            style={styles.loginButtonWrapper}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <View style={styles.loginButton}>
                                <Text style={styles.loginText}>
                                    {loading ? 'Please wait...' : 'Login'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </BlurView>
                </View>
            </KeyboardAwareScrollView>
        </AppBackgroundStudent>

    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#000',
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 40,
    },

    container: {
        flex: 1,
        paddingHorizontal: 25,
        marginTop: 50,
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
        borderRadius: 30,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },

    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#004D57',
        borderRadius: 30,
        marginBottom: 25,
        padding: 3,
    },

    activeToggle: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#81ECFF',
        borderRadius: 25,
    },

    inactiveToggle: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },

    activeText: {
        color: '#000',
        fontFamily: 'DMMono-Regular',
        fontSize: 16,
    },

    inactiveText: {
        color: '#fff',
        fontFamily: 'DMMono-Regular',
        fontSize: 16,
    },

    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        paddingVertical: 12,
        color: '#fff',
        marginBottom: 20,
        fontFamily: 'DMMono-Regular',
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

    loginButtonWrapper: {
        marginTop: 25,
        alignItems: 'center',
    },

    loginButton: {
        paddingVertical: 14,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        backgroundColor: '#81ECFF',
    },

    loginText: {
        fontFamily: 'DMMono-Regular',
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
});