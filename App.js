import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import AppBackground from './component/AppBackground';
import LoginScreen from './Screens/AuthScreens/LoginScreen';

export default function App() {
  return (
    <AppBackground>
      <StatusBar style="light" />
      <LoginScreen />
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