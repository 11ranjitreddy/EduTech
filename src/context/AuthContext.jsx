import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const BASE_URL = 'http://localhost:8081/api/v1/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('edtech_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');

        const result = data.data;

        if (result.requiresMfa) {
            return {
                requires2fa: true,
                isSetupRequired: result.mfaSetupRequired,
                email,
                role: result.role
            };
        }

        const userData = {
            email,
            role: result.role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            name: email.split('@')[0]
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('edtech_user', JSON.stringify(userData));
        return { role: result.role };
    };

    const setupMfa = async (email) => {
        const response = await fetch(`${BASE_URL}/setup-mfa?email=${email}`, {
            method: 'POST'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'MFA setup failed');

        return data.data;
    };

    const verify2fa = async (email, otp) => {
        const response = await fetch(`${BASE_URL}/verify-mfa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code: otp })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'MFA verification failed');

        const result = data.data;
        const userData = {
            email,
            role: result.role,        // ✅ role from backend
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            name: email.split('@')[0]
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('edtech_user', JSON.stringify(userData));
        return userData; // ✅ return full userData so Login.jsx can check role
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('edtech_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, setupMfa, verify2fa, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);