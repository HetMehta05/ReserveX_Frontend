import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppBackground from './component/AppBackground';
import LoginScreen from './Screens/AuthScreens/LoginScreen';
import LandingScreen from './Screens/LandingScreen';
import SplashScreen from './Screens/SplashScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  return (
    <AppBackground>
      <StatusBar style="light" />
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('landing')} />
      )}
      {currentScreen === 'landing' && (
        <LandingScreen onNavigateToLogin={() => setCurrentScreen('login')} />
      )}
      {currentScreen === 'login' && (
        <LoginScreen />
      )}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 100,
  },
});