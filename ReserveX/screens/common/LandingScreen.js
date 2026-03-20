import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppBackgroundStudents from '../../layouts/AppBackgroundStudents';

export default function LandingScreen({ navigation }) {
    return (
        <AppBackgroundStudents >
            <View style={styles.container}>

                <View style={styles.topSpace} />

                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>ReserveX</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        activeOpacity={0.8}
                        onPress={() => navigation.replace('Login')}
                    >
                        <LinearGradient
                            colors={['#C281FF', '#5623CD']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Student</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        activeOpacity={0.8}
                        onPress={() => navigation.replace('Login')}
                    >
                        <LinearGradient
                            colors={['#C281FF', '#5623CD']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Committee Member</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </AppBackgroundStudents>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
    },
    topSpace: {
        flex: 1,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: 55,
        fontFamily: 'Times New Roman',
        color: 'silver',

        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    buttonContainer: {
        flex: 1.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    buttonWrapper: {
        width: '80%',
        marginBottom: 25,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'DMMono-Regular',
        fontSize: 16,
    },
});