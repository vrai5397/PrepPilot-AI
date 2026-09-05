import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

// Register
export async function register({ email, password, username }) {
    try {
        console.log("Attempting registration with:", { username, email });
        const response = await api.post("/api/auth/register", {
            username,
            email,
            password
        });
        console.log("Registration successful:", response.data);
        return response.data;
    } catch (err) {
        console.log("Register API error:", err);
        console.log("Error response:", err.response);
        console.log("Error message:", err.message);
        throw err;
    }
}

// Login
export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email,
            password
        });

        return response.data;
    } catch (err) {
        console.log("Login API error:", err);
        throw err;
    }
}

// Logout
export async function logout() {
    try {
        const response = await api.get("/api/auth/logout");

        return response.data;
    } catch (err) {
        console.log("Logout API error:", err);
        throw err;
    }
}

// Get current user
export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");

        return response.data;
    } catch (err) {
        console.log("GetMe API error:", err);
        throw err;
    }
}

export async function forgotPassword({ email }) {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
}

export async function resetPassword({ token, password }) {
    const response = await api.post("/api/auth/reset-password", {
        token,
        password
    });
    return response.data;
}

export async function validateResetToken({ token }) {
    const response = await api.post("/api/auth/validate-reset-token", { token });
    return response.data;
}