import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// If CLI use:
// import LinearGradient from "react-native-linear-gradient";

const AppBackground = ({ children }) => {
    return (
        <LinearGradient
            colors={[
                "#000000",
                "#0F0C29",
                "#302B63",
                "#5623CD",
                "#15D0EC",
            ]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.container}
        >
            {children}
        </LinearGradient>
    );
};

export default AppBackground;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});