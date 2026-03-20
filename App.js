import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import AppBackground from './component/AppBackground';
import SplashScreen from './Screens/SplashScreen';
import LandingScreen from './Screens/LandingScreen';
import LoginScreen from './Screens/AuthScreens/LoginScreen';
import TabNavigator from './Navigator/TabNavigator';
import CommitteeTabNavigator from './Navigator/CommitteeTabNavigator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen onFinish={() => setCurrentScreen('landing')} />
        );

      case 'landing':
        return (
          <LandingScreen
            onNavigateToLogin={(role) => {
              if (role === 'committee') {
                setCurrentScreen('committeeMain');
              } else {
                setCurrentScreen('login');
              }
            }}
          />
        );

      case 'login':
        return (
          <LoginScreen onLoginSuccess={() => setCurrentScreen('main')} />
        );

      case 'main':
        return <TabNavigator />;

      case 'committeeMain':
        return <CommitteeTabNavigator />;

      default:
        return null;
    }
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <AppBackground>
        <StatusBar style="light" />
        {renderScreen()}
        <Toast />
      </AppBackground>
    </NavigationContainer>
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