import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real check: Ask backend who the current user is
        const checkAuth = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/interviews/api/auth/me/`, { credentials: 'include' });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (err) {
                console.error("Session check failed", err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/interviews/api/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data.user);
            return { success: true };
        } else {
            // DRF often returns errors in different formats. 
            // This captures 'non_field_errors', 'detail', or specific field errors.
            const errorMsg = data.non_field_errors?.[0] || 
                             data.detail || 
                             (typeof data === 'object' ? Object.values(data)[0] : 'Invalid credentials');
            
            return { success: false, error: errorMsg };
        }
    } catch (error) {
        return { success: false, error: 'Server connection failed' };
    }
};

    // frontend/src/context/AuthContext.js

const signup = async (name, company_name, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/interviews/api/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email, 
                full_name: name, 
                company_name: company_name, 
                password: password 
                // username removed! The backend handles it now.
            }),
            credentials: 'include'
        });
        const data = await response.json();

        if (response.ok) {
            // After successful signup, log the user in to establish the session
            return await login(email, password);
        }

        // Return the first error message found in the response object
        const errorMessage = typeof data === 'object' 
            ? Object.values(data)[0] 
            : 'Signup failed';
            
        return { success: false, error: errorMessage };
    } catch (error) {
        console.error("Signup error:", error);
        return { success: false, error: 'Network or Server error' };
    }
};

    const logout = async () => {
        await fetch(`${API_BASE_URL}/interviews/api/auth/logout/`, { method: 'POST', credentials: 'include' });
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
