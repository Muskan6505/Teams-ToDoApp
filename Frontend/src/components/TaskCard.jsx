import React from "react";
import { Calendar, Flag, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function TaskCard({ task }) {

    const { title, description, dueDate, status, priority} = task;
    const createdBy = task.creatorDetails?  task.creatorDetails.name : "Unknown"; 
    const getStatusColor = () => {
        switch (status) {
            case "ToDo":
                return "bg-yellow-500";
            case "In Progress":
                return "bg-blue-500";
            case "Done":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    const getPriorityColor = () => {
        switch (priority) {
            case "High":
                return "text-red-500";
            case "Medium":
                return "text-yellow-400";
            case "Low":
                return "text-green-400";
            default:
                return "text-white";
        }
    };

    return (
        <Link to={`/task/${task._id}`} className="no-underline">
        <div className="bg-gray-100 bg-opacity-10 backdrop-blur-md text-black rounded-lg p-5 shadow-md hover:shadow-xl transition">
            {/* Title + Status Badge */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{title}</h2>
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor()}`}>
                    {status}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm mb-3 text-gray-600 line-clamp-2">{description}</p>

            {/* Info Row */}
            <div className="flex items-center justify-between text-sm text-gray-60000">
                <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(dueDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </span>
                </div>
                <div className={`flex items-center gap-2 font-bold ${getPriorityColor()}`}>
                    <Flag size={16} />
                    <span>{priority}</span>
                </div>
            </div>
        </div>
        </Link>
    );
}
