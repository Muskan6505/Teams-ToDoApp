import React from "react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-4">
            <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
            <p className="text-lg">The page you are looking for does not exist.</p>
            <p className="text-sm mt-4 text-gray-300">
                Go back to the <a href="/" className="text-blue-400 hover:underline">home page</a>.
            </p>
        </div>
    );
}