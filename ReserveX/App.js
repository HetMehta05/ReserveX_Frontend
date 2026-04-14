import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// Screens
import SplashScreen from "./screens/common/SplashScreen";
import LandingScreen from "./screens/common/LandingScreen";
import LoginScreenStudent from "./screens/auth/StudentLogin";
import LoginScreenCommittee from "./screens/auth/CommitteeLogin";
import StudentSignupScreen from "./screens/auth/signup";

// Navigators
import RootNavigator from "./navigation/RootNavigator";
import CommitteeTabNavigator from "./navigation/CommitteeNavigator";

// Context
import { UserProvider, useUser } from "./context/UserContext";
import AuthScreen from "./screens/auth/AuthScreen";

const Stack = createNativeStackNavigator();

// 🔹 App Navigator
function AppNavigator() {
  const { user, loading, setLoading, setUser } = useUser();

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("accessToken");
        const savedUser = await AsyncStorage.getItem("userData");

        if (savedToken && savedUser) {
          // setUser will save token and user in context + AsyncStorage
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.log("Error restoring session:", err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user?.token ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
            <Stack.Screen name="Login_Committee" component={LoginScreenCommittee} />
          </>
        ) : user.role === "committee" ? (
          <Stack.Screen
            name="Committee_Main"
            component={CommitteeTabNavigator}
          />
        ) : (
          <Stack.Screen
            name="Student_Main"
            component={RootNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 🔹 Root App
export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
      <Toast />
    </UserProvider>
  );
}