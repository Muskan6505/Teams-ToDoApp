import React, { useState } from "react";
import logo from "../assets/Logo.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/userSlice";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const res = await axios.post("/api/v1/users/register", {
                name,
                email,
                password,
                confirmPassword,
            });

            console.log("Signup response:", res.data.data);
            alert("Signup successful!");
            dispatch(login(res.data.data));
            navigate("/dashboard");

        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed. Please check your details or try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-4">
            
            {/* Logo + App Name */}
            <div className="flex items-center mb-8 space-x-3">
                <img src={logo} alt="Teams ToDo Logo" className="w-12 h-12 object-contain" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                    Teams ToDo
                </h2>
            </div>

            {/* Glassy Signup Box */}
            <div className="w-full max-w-md bg-opacity-100 backdrop-blur-lg rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">Sign Up</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    
                    {/* Name Field */}
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`px-4 py-3 rounded-lg bg-white bg-opacity-20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                            errors.name ? "focus:ring-red-500" : "focus:ring-purple-700"
                        }`}
                    />
                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

                    {/* Email Field */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`px-4 py-3 rounded-lg bg-white bg-opacity-20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                            errors.email ? "focus:ring-red-500" : "focus:ring-purple-700"
                        }`}
                    />
                    {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

                    {/* Password Field */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`px-4 py-3 rounded-lg bg-white bg-opacity-20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                            errors.password ? "focus:ring-red-500" : "focus:ring-purple-700"
                        }`}
                    />
                    {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

                    {/* Confirm Password Field */}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`px-4 py-3 rounded-lg bg-white bg-opacity-20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                            errors.confirmPassword ? "focus:ring-red-500" : "focus:ring-purple-700"
                        }`}
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-800 hover:to-purple-950 shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 font-semibold"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Login Redirect */}
                <p className="text-center text-sm mt-4 text-gray-300">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
