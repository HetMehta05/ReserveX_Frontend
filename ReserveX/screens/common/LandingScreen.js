import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppBackgroundStudents from '../../layouts/AppBackgroundStudents';
import Logo from "../../assets/ReserveX.svg";
import { useUser } from "../../context/UserContext";

const LandingContent = ({ navigation }) => {
    const { setUser } = useUser();
    return (
        <AppBackgroundStudents>
            <View style={styles.container}>

                {/* Logo */}
                <Logo width={200} height={90} style={styles.logo} />

                {/* Title */}
                <Text style={styles.tagline}>TAGLINE</Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>

                    {/* Student */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('AuthScreen')}
                    >
                        <LinearGradient
                            colors={['#140A3C', 'rgba(255,255,255,0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.card}
                        >
                            <Text style={styles.cardText}>Student</Text>

                            <View style={styles.iconWrapper}>
                                <Ionicons name="school-outline" size={20} color="#fff" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Committee */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                            setUser({
                                id: "dummy-committee",
                                name: "Admin",
                                email: "committee@reservex.com",
                                role: "committee",
                                token: "dummy-auth-token"
                            });
                        }}
                    >
                        <LinearGradient
                            colors={['#140A3C', 'rgba(255,255,255,0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.card}
                        >
                            <Text style={styles.cardText}>Committee</Text>

                            <View style={styles.iconWrapper}>
                                <Ionicons name="people-outline" size={20} color="#fff" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </View>
        </AppBackgroundStudents>
    );
};

export default LandingContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 20,
    },

    title: {
        fontSize: 44,
        color: '#E5E5E5',
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: 1,
    },

    tagline: {
        textAlign: 'center',
        color: '#6EE7FF',
        marginTop: 6,
        marginBottom: 50,
        fontSize: 12,
        letterSpacing: 2,
    },

    buttonContainer: {
        gap: 20,
    },

    card: {
        height: 90,
        borderRadius: 25,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        // subtle glass border
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',

        // shadow for depth
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },

    cardText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },

    iconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',

        // lighter circular highlight (right side)
        backgroundColor: 'rgba(255,255,255,0.10)',
    },
});