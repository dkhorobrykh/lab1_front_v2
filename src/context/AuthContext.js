import axios from 'axios';
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {BASE_API_URL} from "../config/config";
import api from "../api/UseAxiosErrorInterceptor";
import {ErrorContext} from "./ErrorContext";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [user, setUser] = useState(null);
    const {setError, setSuccess} = useContext(ErrorContext);

    const fetchUserInfo = useCallback(async ({needToLogging}) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/user/info`);
            setUser(response.data);
            if (needToLogging) setSuccess({message: "User data has been successfully received"});

            return true;

        } catch (error) {
            setError(error.response.data);
            console.error('Ошибка получения данных пользователя:', error);
        }

        return false;
    }, [setError, setSuccess]);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            fetchUserInfo({needToLogging: true});
        }
    }, [fetchUserInfo]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('jwtToken', token);
        } else {
            localStorage.removeItem('jwtToken');
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;
        const intervalId = setInterval(() => {
            fetchUserInfo({needToLogging: false});
        }, 5000);

        return () => clearInterval(intervalId);
    }, [token, fetchUserInfo]);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUserInfo({needToLogging: true});
        }
    }, [fetchUserInfo, token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${BASE_API_URL}/auth/login`, {username, password});
            const {token} = response.data;

            if (token) {
                setToken(token);
                localStorage.setItem('jwtToken', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setSuccess({message: "Authorization is successful!"});

                return true;
            } else {
                console.error("С бэка при авторизации не пришел jwt Токен");
                setError({message: "Server error. Try again later."});
            }
        } catch (error) {
            setError(error.response.data);
            console.error('Ошибка при логине:', error);
        }

        return false;
    };

    const register = async (username, password) => {
        try {
            const response = await axios.post(`${BASE_API_URL}/auth/register`, {username, password});
            const {token} = response.data;

            if (token) {
                setToken(token);
                localStorage.setItem('jwtToken', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setSuccess({message: "Registration is successful!"});

                return true;
            } else {
                setError({message: "Server error. Please, try again later."});
                console.error("Во время регистрации с бэка пришел пустой jwt-токен");
            }
        } catch (error) {
            setError(error.response.data);
            console.error('Ошибка при регистрации:', error);
        }

        return false;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwtToken');
        delete axios.defaults.headers.common['Authorization'];

        setSuccess({message: "Logout is successful!"});
    };

    // const refreshAuthToken = async () => {
    //     try {
    //         const response = await axios.post(`${BASE_API_URL}/auth/refresh-token`);
    //         const {token} = response.data;
    //
    //         if (token) {
    //             setToken(token);
    //             localStorage.setItem('jwtToken', token);
    //             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //         } else {
    //             logout();
    //         }
    //     } catch (error) {
    //         console.error('Ошибка обновления токена:', error);
    //         logout();
    //         throw error;
    //     }
    // };

    return (
        <AuthContext.Provider value={{user, token, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}