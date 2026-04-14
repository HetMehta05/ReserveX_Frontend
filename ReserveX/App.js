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
import SignupScreen from "./screens/auth/signup";

// Navigator
import RootNavigator from "./navigation/RootNavigator";
import { CommitteeTabNavigator } from "./navigation/CommitteeNavigator";
import CommitteeStack from "./navigation/CommitteeNavigator";
// Context
import { UserProvider, useUser } from "./context/UserContext";



const Stack = createNativeStackNavigator();


// 🔹 Separate navigator component (clean pattern)
function AppNavigator() {
  const { token, user, loading, setLoading, setToken } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");

        if (storedToken) {
          setToken(storedToken);
        }
      } catch (err) {
        console.log("Auth check error:", err);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {!token ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login_Student" component={LoginScreenStudent} />
            <Stack.Screen name="Signup_Student" component={SignupScreen} />
            <Stack.Screen name="Login_Committee" component={LoginScreenCommittee} />
          </>
        ) : user?.role === "committee" ? (
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