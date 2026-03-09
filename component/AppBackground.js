import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AppBackground = ({ children }) => {
    return (
        <View style={styles.container}>

            {/* Base: pure black */}
            <LinearGradient
                colors={['#000000', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            {/* Deep violet diagonal */}
            <LinearGradient
                colors={['#4A0DA8', '#2E0870', '#0E0025', '#000000']}
                locations={[0, 0.1, 0.55, 0.76]}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 0.8 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Lighter violet bloom */}
            <LinearGradient
                colors={['#6B25DD', 'transparent']}
                locations={[0, 0.8]}
                start={{ x: 0.1, y: 0.0 }}
                end={{ x: 0.8, y: 0.7 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
            />

            {/* Bright violet spotlight — low opacity */}
            <LinearGradient
                colors={['transparent', '#9B50FF', 'transparent']}
                locations={[0, 0.5, 1]}
                start={{ x: 0.0, y: 0.2 }}
                end={{ x: 0.7, y: 0.6 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.25 }]}
            />

            {/* Teal — tight bottom-right corner */}
            <LinearGradient
                colors={['transparent', '#0D5C4E']}
                start={{ x: 0.65, y: 0.76 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {children}
        </View>
    );
};

export default AppBackground;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});