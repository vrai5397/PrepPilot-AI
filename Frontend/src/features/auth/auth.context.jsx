import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {

        const fetchUser = async () => {

            try {
                const data = await getMe();

                setuser(data.user);

            } catch (err) {
                console.log("Get user error:", err);

                setuser(null);

            } finally {
                setloading(false);
            }
        };

        fetchUser();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setuser,
                loading,
                setloading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};