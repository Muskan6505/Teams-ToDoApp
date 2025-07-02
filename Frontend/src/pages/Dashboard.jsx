import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { Search } from "lucide-react";
import TaskCard from "../components/TaskCard";
import axios from "axios";
import { setTasks } from "../features/taskSlice.js";

export default function Dashboard() {
    const user = useSelector((state) => state.user.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [priorityFilter, setPriorityFilter] = useState("All Priority");
    const [role, setRole] = useState("assignee");
    const [Tasks, setTaskss] = useState([]);
    const [totalTasks, setTotal] = useState(0);
    const [completedTasks, setCompleted] = useState(0);
    const [inProgressTasks, setInProgress] = useState(0);
    const [pendingTasks, setPendings] = useState(0);
    const [deadlineApproaching, setDeadline] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const dispatch = useDispatch();

    const countTasks = (Task) => {
        setTotal(Task?.length || 0);
        setCompleted(Task?.filter((t) => t.status === "Done").length);
        setInProgress(Task?.filter((t) => t.status === "In Progress").length);
        setPendings(Task?.filter((t) => t.status === "ToDo").length);
        setDeadline(
        Task?.filter((t) => {
            const due = new Date(t.dueDate);
            const today = new Date();
            const diffInDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            return diffInDays >= 0 && diffInDays <= 2 && t.status !== "Done";
        }).length
        );
    };

    const handleSearch = async () => {
        try {
        const res = await axios.get("/api/v1/users/tasks", {
            params: {
            search: searchTerm,
            dueDate: "upcoming",
            status: statusFilter === "All Status" ? "" : statusFilter,
            priority: priorityFilter === "All Priority" ? "" : priorityFilter,
            role: role,
            },
            withCredentials: true,
        });
        setTaskss(res.data?.tasks || res.data?.docs || []);
        dispatch(setTasks(res.data.docs));
        countTasks(res.data.docs);
        } catch (error) {
        console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [statusFilter, priorityFilter, role]);

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-6 py-6 overflow-scroll">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pt-6 gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                Welcome, {user?.name || "User"} 👋
            </h1>
            <div className="flex flex-wrap gap-2">
                <button
                onClick={() => setRole("assignee")}
                className={`px-4 py-2 rounded-lg shadow transition font-semibold ${
                    role === "assignee"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-purple-700"
                }`}
                >
                Tasks Assigned to Me
                </button>
                <button
                onClick={() => setRole("creator")}
                className={`px-4 py-2 rounded-lg shadow transition font-semibold ${
                    role === "creator"
                    ? "bg-pink-700 text-white"
                    : "bg-white text-pink-800"
                }`}
                >
                Tasks Assigned by Me
                </button>
            </div>
            </div>

            {/* Stats Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 text-black">
            {[
                { label: "Total Tasks", value: totalTasks, color: "text-green-800" },
                { label: "Completed", value: completedTasks, color: "text-indigo-800" },
                { label: "In Progress", value: inProgressTasks, color: "text-amber-600" },
                { label: "Pending", value: pendingTasks, color: "text-cyan-700" },
                { label: "Deadline Soon", value: deadlineApproaching, color: "text-red-800" },
            ].map((stat, i) => (
                <div
                key={i}
                className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-center shadow"
                >
                <h2 className="text-2xl font-bold text-black">{stat.value}</h2>
                <p className={`text-lg mt-1 ${stat.color}`}>{stat.label}</p>
                </div>
            ))}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-row gap-3 md:gap-6 mb-6">
            <div className="relative w-full md:w-1/2">
                <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
                <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-700 hover:text-purple-900"
                >
                <Search size={20} />
                </button>
            </div>

            {/* Small Screen Filters Button */}
            <div className="flex md:hidden">
                <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white bg-opacity-20 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                >
                Filters
                </button>
            </div>

            {/* Medium+ Screen Filters */}
            <div className="hidden md:flex gap-4">
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-black focus:outline-none focus:ring-2 focus:ring-purple-700"
                >
                <option>All Status</option>
                <option>ToDo</option>
                <option>In Progress</option>
                <option>Done</option>
                </select>

                <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-black focus:outline-none focus:ring-2 focus:ring-purple-700"
                >
                <option>All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                </select>
            </div>
            </div>

            {/* Filter Dropdown for Small Screens */}
            {showFilters && (
            <div className="md:hidden mb-6 space-y-4">
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-black focus:outline-none focus:ring-2 focus:ring-purple-700"
                >
                <option>All Status</option>
                <option>ToDo</option>
                <option>In Progress</option>
                <option>Done</option>
                </select>

                <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-black focus:outline-none focus:ring-2 focus:ring-purple-700"
                >
                <option>All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                </select>
            </div>
            )}

            {/* Task List Section */}
            <div className="mt-10 min-h-[200px]">
            {Array.isArray(Tasks) && Tasks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                ))}
                </div>
            ) : (
                <div className="text-center text-gray-300 mt-10 text-lg">
                {Tasks?.length === 0 ? "No tasks found." : "Loading tasks..."}
                </div>
            )}
            </div>
        </div>
        </>
    );
}
