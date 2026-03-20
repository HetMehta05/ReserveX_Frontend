import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CommitteeBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Black base */}
      <LinearGradient
        colors={['#000000', '#000000']}
        style={StyleSheet.absoluteFill}
      />

      {/* Teal glow — top, spreads further down now */}
      <LinearGradient
        colors={['#00BF8F', 'rgba(0,150,100,0.5)', 'rgba(0,100,70,0.2)', 'transparent']}
        locations={[0, 0.35, 0.6, 0.8]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.6, y: 0.85 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Blue diagonal — wider and lower */}
      <LinearGradient
        colors={['transparent', 'rgba(0,120,220,0.4)', 'transparent']}
        locations={[0.05, 0.45, 0.75]}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 1, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Dark overlay — pushed lower so colors breathe more */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', '#000000']}
        locations={[0.5, 0.75, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Purple — more spread, lighter */}
      <LinearGradient
        colors={['transparent', 'rgba(130,50,255,0.4)', 'rgba(100,20,255,0.3)']}
        locations={[0.55, 0.8, 1]}
        start={{ x: 0.2, y: 0.65 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill}>
        {children}
      </View>
    </View>
  );
};

export default CommitteeBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
