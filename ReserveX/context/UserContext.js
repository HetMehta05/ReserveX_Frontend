import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token;

    // ✅ Restore token on app start
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("accessToken");

                if (savedToken) {
                    setToken(savedToken);
                }
            } catch (e) {
                console.log("Error restoring token", e);
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
                isAuthenticated, // ✅ useful
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);