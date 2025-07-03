import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

export default function SingleTask() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
    });

    const isCreator = task?.createdBy?._id === currentUser?._id;
    const isAssignee = task?.assignedTo?._id === currentUser?._id;

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(`/api/v1/tasks/${taskId}`, {
                    withCredentials: true,
                });
                const fetchedTask = res.data?.data;
                setTask(fetchedTask);
                setNewStatus(fetchedTask?.status || "");
                setEditForm({
                    title: fetchedTask.title,
                    description: fetchedTask.description,
                    priority: fetchedTask.priority,
                    dueDate: fetchedTask.dueDate?.split("T")[0], // yyyy-mm-dd
                });
                setLoading(false);
            } catch (err) {
                setError("Failed to load task.");
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axios.delete(`/api/v1/tasks/${taskId}`, { withCredentials: true });
            navigate("/dashboard");
        } catch (err) {
            alert("Error deleting task.");
        }
    };

    const handleStatusUpdate = async () => {
        try {
            const res = await axios.patch(
                `/api/v1/tasks/${taskId}`,
                { status: newStatus },
                { withCredentials: true }
            );
            setTask(res.data.data);
            alert("Status updated!");
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(
                `/api/v1/tasks/${taskId}`,
                { ...editForm },
                { withCredentials: true }
            );
            setTask(res.data.data);
            alert("Task updated successfully!");
            setEditMode(false);
        } catch (err) {
            alert("Failed to update task.");
        }
    };

    if (loading) return <div className="text-center p-10 text-white">Loading task...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-6 py-10 pt-25">
                <div className="max-w-3xl mx-auto bg-opacity-100 p-6 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    {!editMode ? (
                        <>
                            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
                            <p className="text-lg text-gray-300 mb-4">{task.description}</p>

                            <div className="space-y-2 text-sm text-gray-300">
                                <p><strong>Status:</strong> {task.status}</p>
                                <p><strong>Priority:</strong> {task.priority}</p>
                                <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString("en-IN")}</p>
                                <p><strong>Created By:</strong> {task.createdBy?.name}</p>
                            </div>
                        </>
                    ) : (
                        <form
                        onSubmit={handleEditSubmit}
                        className="bg-white/10 backdrop-blur-md p-6 rounded-xl space-y-4 border border-white/20 shadow-md"
                        >
                        <h2 className="text-2xl font-bold text-white mb-4">Edit Task</h2>

                        {/* Title */}
                        <div>
                        <label className="block text-white mb-1 font-medium">Title</label>
                        <input
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter task title"
                            required
                        />
                        </div>

                        {/* Description */}
                        <div>
                        <label className="block text-white mb-1 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter task description"
                            rows={4}
                            required
                        />
                        </div>

                        {/* Priority & Due Date */}
                        <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <label className="block text-white mb-1 font-medium">Priority</label>
                            <select
                            name="priority"
                            value={editForm.priority}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                            required
                            >
                            <option value="">Select Priority</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block text-white mb-1 font-medium">Due Date</label>
                            <input
                            type="date"
                            name="dueDate"
                            value={editForm.dueDate}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                            required
                            />
                        </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition font-semibold shadow"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition font-semibold shadow"
                        >
                            Cancel
                        </button>
                        </div>
                        </form>
                    )}

                    {/* Controls */}
                    <div className="mt-6 space-x-4 space-y-3">
                        {(isCreator || isAssignee) && (
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="px-4 py-2 rounded bg-white text-black"
                            >
                                <option>ToDo</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                        )}

                        {isAssignee && (
                            <button
                                onClick={handleStatusUpdate}
                                className="bg-blue-600 px-4 py-2 rounded text-white"
                            >
                                Update Status
                            </button>
                        )}

                        {isCreator && !editMode && (
                            <>
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="bg-yellow-500 px-4 py-2 rounded text-black"
                                >
                                    Edit Task
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 px-4 py-2 rounded text-white"
                                >
                                    Delete Task
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
