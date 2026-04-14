import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [token, setTokenState] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token;

    // ✅ Persist user when set
    const setUser = async (userData) => {
        setUserState(userData);
        try {
            if (userData) {
                await AsyncStorage.setItem("userData", JSON.stringify(userData));
            } else {
                await AsyncStorage.removeItem("userData");
            }
        } catch (e) {
            console.log("Error saving user data", e);
        }
    };

    // ✅ Persist token when set
    const setToken = async (tokenValue) => {
        setTokenState(tokenValue);
        try {
            if (tokenValue) {
                await AsyncStorage.setItem("accessToken", tokenValue);
            } else {
                await AsyncStorage.removeItem("accessToken");
            }
        } catch (e) {
            console.log("Error saving token", e);
        }
    };

    // ✅ Restore both token and user on app start
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("accessToken");
                const savedUser = await AsyncStorage.getItem("userData");

                if (savedToken) {
                    setTokenState(savedToken);
                }
                if (savedUser) {
                    setUserState(JSON.parse(savedUser));
                }
            } catch (e) {
                console.log("Error restoring session", e);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    return (
        <UserContext.Provider
            value={{
                token,
                setToken,
                user,
                setUser,
                loading,
                setLoading,
                isAuthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);