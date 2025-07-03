import React from "react";
import logo from "../assets/logo.png"; // consider WebP
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-black text-white px-4 relative overflow-hidden">

        {/* Glow animation behind */}
        <div className="absolute w-[30rem] h-[30rem] bg-purple-800 rounded-full blur-3xl opacity-20 top-0 -left-20 animate-pulse" />
        <div className="absolute w-[25rem] h-[25rem] bg-pink-700 rounded-full blur-3xl opacity-20 bottom-0 -right-10 animate-pulse" />

        {/* Logo and name */}
        <div className="flex items-center mb-8 space-x-3 z-10">
            <img src={logo} alt="Teams ToDo Logo" className="w-14 h-14 object-contain" />
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Teams ToDo
            </h2>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-violet-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg whitespace-nowrap z-10">
            Unleash Your Team’s Productivity
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-center max-w-xl text-gray-300 mb-10 z-10">
            Manage team tasks, assign responsibilities, and track progress with an intuitive Kanban experience.
        </p>

        {/* CTA Button */}
        <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg font-semibold z-10"
        >
            Get Started <ArrowRight size={20} />
        </Link>
        </div>
    );
}
