import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
    const [formVisible, setFormVisible] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignee: "",
        status: "ToDo",
    });

    const [errors, setErrors] = useState({});
    const [taskList, setTaskList] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const user = useSelector((state) => state.user?.user);

    // Fetch team members
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get("/api/v1/users/all");
                setTeamMembers(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching team members:", error);
            }
        };

        fetchTeamMembers();
    }, []);

    // Fetch tasks created by current user
    const fetchTasks = async () => {
        try {
            const res = await axios.get("/api/v1/users/tasks", {
                params: { role: "creator" },
                withCredentials: true,
            });
            setTaskList(res.data?.tasks || res.data?.docs || []);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.dueDate) {
            newErrors.dueDate = "Due date is required";
        } else if (new Date(form.dueDate) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.dueDate = "Due date cannot be in the past";
        }
        if (!form.assignee) newErrors.assignee = "Assignee is required";
        return newErrors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await axios.post("/api/v1/tasks/add", form);
            console.log("Task created:", res.data);
            alert("Task created successfully!");
            fetchTasks(); // refresh the list

            setForm({
                title: "",
                description: "",
                dueDate: "",
                priority: "Medium",
                assignee: "",
                status: "ToDo",
            });
            setErrors({});
            setFormVisible(false);
        } catch (error) {
            console.error("Task creation failed:", error);
            alert("Failed to create task. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-6 py-10">
                <div className="flex md:justify-between  md:flex-row flex-col items-center mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                        Your Created Tasks
                    </h1>
                    <button
                        onClick={() => setFormVisible(!formVisible)}
                        className="px-5 py-2 bg-gradient-to-r ml-40 lg:ml-0 from-pink-600 to-purple-600 rounded-lg shadow hover:from-pink-700 hover:to-purple-700 transition"
                    >
                        {formVisible ? "Cancel" : "Add New Task"}
                    </button>
                </div>

                {formVisible && (
                    <form
                        onSubmit={handleSubmit}
                        className=" bg-opacity-100 backdrop-blur-lg p-6 rounded-xl max-w-2xl mx-auto mb-10 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        {/* Title */}
                        <div>
                            <label className="block mb-1">Title *</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-black"
                                placeholder="Task title"
                            />
                            {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <label className="block mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-black"
                                placeholder="Describe the task..."
                            />
                            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                        </div>

                        {/* Due Date */}
                        <div className="mt-4">
                            <label className="block mb-1">Due Date *</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-black"
                            />
                            {errors.dueDate && <p className="text-red-400 text-sm">{errors.dueDate}</p>}
                        </div>

                        {/* Priority, Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block mb-1">Priority</label>
                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-black"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-black"
                                >
                                    <option>ToDo</option>
                                    <option>In Progress</option>
                                    <option>Done</option>
                                </select>
                            </div>
                        </div>

                        {/* Assignee */}
                        <div className="mt-4">
                            <label className="block mb-1">Assignee *</label>
                            <select
                                name="assignee"
                                value={form.assignee}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-black"
                            >
                                <option value="">Select Member</option>
                                {teamMembers.map((member) => (
                                    member.name !== user.name && (
                                        <option key={member._id} value={member.name}>
                                            {member.name}
                                        </option>
                                    )
                                ))}
                            </select>
                            {errors.assignee && <p className="text-red-400 text-sm">{errors.assignee}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded font-semibold hover:from-purple-700 hover:to-indigo-700"
                        >
                            Create Task
                        </button>
                    </form>
                )}

                {/* Task List Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {taskList.length > 0 ? (
                        taskList.map((task) => (
                            <TaskCard key={task._id} task={task} />
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-300 text-lg">No tasks found.</p>
                    )}
                </div>
            </div>
        </>
    );
}
