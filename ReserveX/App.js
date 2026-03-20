import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// Screens
import SplashScreen from "./screens/common/SplashScreen";
import LandingScreen from "./screens/common/LandingScreen";
import LoginScreen from "./screens/auth/LoginScreen";

// Navigator
import RootNavigator from "./navigation/RootNavigator";

// Context
import { UserProvider, useUser } from "./context/UserContext";
import CommitteeTabNavigator from "./navigation/CommitteeNavigator";

const Stack = createNativeStackNavigator();


// 🔹 Separate navigator component (clean pattern)
function AppNavigator() {
  const { token, setToken, role, setRole, loading, setLoading } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");

        if (storedToken) {
          setToken(storedToken);
          const storedRole = await AsyncStorage.getItem("userRole");
          if (storedRole) setRole(storedRole);
        }
      } catch (err) {
        console.log("Auth check error:", err);
      } finally {
        // splash delay (optional)
        setTimeout(() => setLoading(false), 1000);
      }
    };

    checkAuth();
  }, []);


  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {!token ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : role === 'committee' ? (
          <>
            <Stack.Screen name="CommitteeTabs" component={CommitteeTabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={RootNavigator} />
          </>
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