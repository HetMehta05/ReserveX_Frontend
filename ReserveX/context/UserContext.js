import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext(null);

export const STORAGE_KEY = "auth_user";

export const UserProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user?.token;

    // ✅ Restore session
    useEffect(() => {
        const restore = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setUserState(JSON.parse(stored));
                }
            } catch (err) {
                console.log("Restore session error:", err);
            } finally {
                setLoading(false);
            }
        };

        restore();
    }, []);

    // ✅ Save session
    const setUser = async (userData) => {
        try {
            if (!userData) {
                await AsyncStorage.removeItem(STORAGE_KEY);
                setUserState(null);
                return;
            }

            const cleanUser = {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                token: userData.token,
            };

            setUserState(cleanUser);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cleanUser));
        } catch (err) {
            console.log("Save session error:", err);
        }
    };

    // ✅ Logout
    const logout = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setUserState(null);
        } catch (err) {
            console.log("Logout error:", err);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                logout,
                loading,
                isAuthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);