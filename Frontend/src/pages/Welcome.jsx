import React from "react";
import logo from "../assets/Logo.png";
export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-4">
            
            {/* Logo + Website Name */}
            <div className="flex items-center mb-8 space-x-3">
                <img src={logo} alt="Teams ToDo Logo" className="w-12 h-12 object-contain" />
                <h2 className="text-2xl font-bold text-white bg-clip-text text-underline">
                    Teams ToDo
                </h2>
            </div>

            {/* Gradient Text Heading */}
            <h1 className="text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-400 via-violet-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg">
                Unleash Your Team's Productivity
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl mb-10 text-center max-w-xl opacity-90">
                Create, assign, and track team tasks efficiently. Stay organized, stay productive.
            </p>

            {/* Get Started Button */}
            <a
                href="/login"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-800 hover:to-purple-950 shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 text-lg font-semibold"
            >
                Get Started
            </a>
        </div>
    );
}
