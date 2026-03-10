import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Wait for 3 seconds then navigate out of splash screen
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Temporary Logo Placeholder */}
        <Text style={styles.logoText}>ReserveX</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 60,
    fontFamily: 'Times New Roman',
    color: 'silver',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
