import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../components/TaskCard";
import axios from "axios";

const statuses = ["ToDo", "In Progress", "Done"];

export default function KanbanBoard() {
    const [columns, setColumns] = useState({
        "ToDo": { name: "ToDo", items: [] },
        "In Progress": { name: "In Progress", items: [] },
        "Done": { name: "Done", items: [] },
    });

    useEffect(() => {
        const fetchTasks = async () => {
        try {
            const res = await axios.get("/api/v1/users/tasks", {
            params: { role: "assignee" },
            withCredentials: true,
            });
            const tasksByStatus = statuses.reduce((acc, status) => {
            acc[status] = { name: status, items: [] };
            return acc;
            }, {});

            res.data.docs.forEach(task => {
            if (tasksByStatus[task.status]) {
                tasksByStatus[task.status].items.push(task);
            }
            });
            setColumns(tasksByStatus);
        } catch (err) {
            console.error("Failed loading tasks:", err);
        }
        };
        fetchTasks();
    }, []);

    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceCol = columns[source.droppableId];
        const destCol = columns[destination.droppableId];
        const sourceItems = Array.from(sourceCol.items);
        const [moved] = sourceItems.splice(source.index, 1);
        const destItems = Array.from(destCol.items);
        destItems.splice(destination.index, 0, moved);

        // Update UI state
        setColumns({
            ...columns,
            [source.droppableId]: { ...sourceCol, items: sourceItems },
            [destination.droppableId]: { ...destCol, items: destItems },
        });

        try {
            await axios.patch(`/api/v1/tasks/${moved._id}`, {
                status: destination.droppableId,
            }, {
                withCredentials: true,
            });
        } catch (err) {
            console.error("Failed to update task status:", err);
        }
    };


    return (
        <>
        <Navbar />
        <div style={{overflow:scroll, scrollbarWidth:"none"}} className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-pink-900 text-white px-6 py-6 pt-25">
            <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-violet-600 to-pink-600 bg-clip-text text-transparent">
            Kanban Board
            </h1>

            <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-4">
                {statuses.map(status => (
                <Droppable droppableId={status} key={status}>
                    {(provided) => (
                    <div
                        className="flex-1 bg-opacity-100 backdrop-blur-lg rounded-lg p-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <h2 className="text-xl font-semibold mb-4">{status}</h2>
                        {columns[status].items.map((task, idx) => (
                        <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={idx}
                        >
                            {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-4"
                            >
                                <TaskCard task={task} />
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
                ))}
            </div>
            </DragDropContext>
        </div>
        </>
    );
}
