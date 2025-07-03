import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { Mail, User, Calendar, Pencil, Save, X } from "lucide-react";
import axios from "axios";
import { login } from "../features/userSlice";

export default function Profile() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    const handleSave = async () => {
        try {
            const response = await axios.patch(
                "/api/v1/users/update",
                { name, email },
                { withCredentials: true }
            );
            const updatedUser = response.data.data;
            dispatch(login(updatedUser));
            setEmail(updatedUser.email);
            setName(updatedUser.name);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        }
    };

    const handleCancel = () => {
        setName(user?.name || "");
        setEmail(user?.email || "");
        setIsEditing(false);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-6 py-12 flex justify-center items-start pt-28">
                <div className="w-full max-w-2xl bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)] animate-fadeIn">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                            My Profile
                        </h1>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow transition-all"
                            >
                                <Pencil size={16} /> Edit
                            </button>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-6">
                        {/* Name */}
                        <div className="flex items-center gap-4">
                            <User className="text-purple-400" />
                            <div className="w-full">
                                <p className="text-sm text-gray-400">Name</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg bg-white bg-opacity-80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-4">
                            <Mail className="text-purple-400" />
                            <div className="w-full">
                                <p className="text-sm text-gray-400">Email</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg bg-white bg-opacity-80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="Your Email"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold">{user?.email || "N/A"}</p>
                                )}
                            </div>
                        </div>

                        {/* Joined Date */}
                        <div className="flex items-center gap-4">
                            <Calendar className="text-purple-400" />
                            <div>
                                <p className="text-sm text-gray-400">Joined</p>
                                <p className="text-lg font-semibold">
                                    {user?.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-4 mt-10 justify-center">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow"
                            >
                                <Save size={16} /> Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow"
                            >
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
