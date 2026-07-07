import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Fetch user on mount if token exists
    useEffect(() => {
        if (token) {
            API.get('/user') // We'll need a /api/user endpoint in Laravel
                .then(res => setUser(res.data))
                .catch(() => {
                    logout(); // Invalid token
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {

        const res = await API.post('/auth/login', { email, password });
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
    };

    const register = async (data) => {
        const res = await API.post('/auth/register', data);
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
    };

    const logout = () => {
        API.post('/auth/logout').catch(() => { });
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);