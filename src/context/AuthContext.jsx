import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('edtech_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock authentication logic
        let role = 'student';
        if (email.toLowerCase().includes('admin')) {
            role = 'admin';
            const is2faSetup = localStorage.getItem(`2fa_setup_${email}`) === 'true';
            return { requires2fa: true, isSetupRequired: !is2faSetup, email, role };
        }

        const userData = { email, role, name: email.split('@')[0] };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('edtech_user', JSON.stringify(userData));
        return { role };
    };

    const confirm2faSetup = (email) => {
        localStorage.setItem(`2fa_setup_${email}`, 'true');
    };

    const verify2fa = (email, role, otp) => {
        // Mock OTP verification
        if (otp === '123456') {
            const userData = { email, role, name: email.split('@')[0] };
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('edtech_user', JSON.stringify(userData));
            confirm2faSetup(email); // Ensure marked as setup
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('edtech_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, verify2fa, confirm2faSetup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
