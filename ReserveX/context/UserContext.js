import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token;

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
            role,
            setRole,
            isAuthenticated,
            loading,
            setLoading
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);