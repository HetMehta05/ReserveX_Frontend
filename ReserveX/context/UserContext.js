import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // ✅ store id, email, role, token here
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user?.token;

    // ✅ Restore session on app start
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("accessToken");
                const savedUser = await AsyncStorage.getItem("userData"); // optional persistent user

                if (savedToken && savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (e) {
                console.log("Error restoring user session", e);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    // ✅ Save token + user persistently when user logs in
    const saveUserSession = async (userData) => {
        try {
            setUser(userData);
            await AsyncStorage.setItem("accessToken", userData.token);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
        } catch (e) {
            console.log("Error saving user session", e);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,                 // ✅ includes user.id, email, role, token
                setUser: saveUserSession, // ✅ always use this to save persistently
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