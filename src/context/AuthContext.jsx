import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
     const router = useRouter(); 
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token) => {
        setIsLoading(true);
        await AsyncStorage.setItem('authToken', token);
        setUserToken(token);
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        await AsyncStorage.removeItem('authToken');
        setUserToken(null);
        setIsLoading(false);
        router.replace("/")
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setUserToken(token);
            setIsLoading(false);
        };
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
