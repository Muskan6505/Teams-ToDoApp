import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import { User, Menu, X } from "lucide-react";

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const linkClasses = ({ isActive }) =>
        isActive
            ? "text-purple-400 font-semibold border-b-2 border-purple-400"
            : "hover:text-purple-300 transition";

    return (
        <nav className="w-full bg-gradient-to-r from-black via-indigo-950 to-pink-900 text-white shadow-md">
            <div className="flex items-center justify-between px-6 py-4 relative">
                
                {/* Logo + App Name */}
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="Teams ToDo Logo" className="w-10 h-10 object-contain" />
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                        Teams ToDo
                    </h2>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <NavLink to="/dashboard" className={linkClasses}>Dashboard</NavLink>
                    <NavLink to="/tasks" className={linkClasses}>Tasks</NavLink>
                    <NavLink to="/kanban" className={linkClasses}>Kanban</NavLink>
                </div>

                {/* Profile Icon & Mobile Toggle */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden focus:outline-none"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition"
                        >
                            <User className="text-gray-300 w-5 h-5" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-gray-800 bg-opacity-10 backdrop-blur-md rounded shadow-md py-2 z-50">
                                <NavLink
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-white hover:text-purple-400 transition"
                                    onClick={() => setShowMenu(false)}
                                >
                                    My Profile
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-white hover:text-red-600 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Links */}
            {mobileOpen && (
                <div className="md:hidden px-6 pb-4 flex flex-col space-y-3 text-sm font-medium">
                    <NavLink
                        to="/dashboard"
                        className={linkClasses}
                        onClick={() => setMobileOpen(false)}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/tasks"
                        className={linkClasses}
                        onClick={() => setMobileOpen(false)}
                    >
                        Tasks
                    </NavLink>
                    <NavLink
                        to="/kanban"
                        className={linkClasses}
                        onClick={() => setMobileOpen(false)}
                    >
                        Kanban Board
                    </NavLink>
                </div>
            )}
        </nav>
    );
}
