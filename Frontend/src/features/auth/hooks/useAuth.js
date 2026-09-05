
// api hit function are made handle them
// set loading set user
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    validateResetToken
} from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext);

    const {
        user,
        setuser,
        loading,
        setloading
    } = context;


    // LOGIN
   const handleLogin = async ({ email, password }) => {
    try {
        setloading(true);

        const data = await login({
            email,
            password
        });

        setuser(data.user);

        return data;
    } catch (err) {
        console.log("Login error:", err);
        throw err;
    } finally {
        setloading(false);
    }
};
    // REGISTER
   const handleRegister = async ({ email, password, username }) => {
    try {
        setloading(true);

        const data = await register({
            email,
            password,
            username
        });

        setuser(data.user);

        return data;
    } catch (err) {
        console.log("Register error:", err);
        throw err;
    } finally {
        setloading(false);
    }
};
    // LOGOUT
    const handleLogout = async () => {
        try {
            setloading(true);

            await logout();

            setuser(null);

        } catch (err) {
            console.log("Logout error:", err);

        } finally {
            setloading(false);
        }
    };

    const handleForgotPassword = async ({ email }) => {
        return forgotPassword({ email });
    };

    const handleResetPassword = async ({ token, password }) => {
        return resetPassword({ token, password });
    };

    const handleValidateResetToken = async ({ token }) => {
        return validateResetToken({ token });
    };

    return {
        user,
        loading,
        handleLogin,
        handleLogout,
        handleRegister,
        handleForgotPassword,
        handleResetPassword,
        handleValidateResetToken
    };
};