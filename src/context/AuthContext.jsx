import { createContext, useContext, useState, useEffect } from 'react';

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
        // Check if user is already logged in (from localStorage/session)
        const storedUser = localStorage.getItem('recruiterUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // TODO: Replace with actual API call to backend
            // const response = await fetch('/api/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();

            // Temporary mock implementation
            const mockUser = {
                id: '1',
                email: email,
                name: email.split('@')[0],
                role: 'recruiter'
            };

            setUser(mockUser);
            localStorage.setItem('recruiterUser', JSON.stringify(mockUser));
            // TODO: Store JWT token from backend
            // localStorage.setItem('authToken', data.token);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const signup = async (name, email, password) => {
        try {
            // TODO: Replace with actual API call to backend
            // const response = await fetch('/api/auth/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, password })
            // });
            // const data = await response.json();

            // Temporary mock implementation
            const mockUser = {
                id: Date.now().toString(),
                email: email,
                name: name,
                role: 'recruiter'
            };

            setUser(mockUser);
            localStorage.setItem('recruiterUser', JSON.stringify(mockUser));
            // TODO: Store JWT token from backend
            // localStorage.setItem('authToken', data.token);

            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('recruiterUser');
        // TODO: Clear JWT token
        // localStorage.removeItem('authToken');

        // TODO: Optional - Call backend to invalidate session
        // fetch('/api/auth/logout', { method: 'POST' });
    };

    const value = {
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
