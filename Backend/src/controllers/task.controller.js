import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {Task} from '../models/task.model.js';


const addTask = asyncHandler(async (req, res) => {
    const {title, description, dueDate, priority, assignedTo} = req.body;

    if (!title || !description || !dueDate || !priority) {
        throw new ApiError(400, "All fields are required");
    }

    const task = await Task.create({
        title,
        description,
        dueDate,
        priority,
        createdBy: req.user._id,
        assignedTo
    });

    if(!task) {
        throw new ApiError(500, "Failed to create task");
    }

    return res.
    status(201).
    json(
        new ApiResponse(201, task),
        "Task created successfully"
    );
});

const getTaskById = asyncHandler(async (req, res) => {
    const {taskId} = req.params;

    const task = await Task.findById(taskId)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.
    status(200).    
    json(
        new ApiResponse(200, task),
        "Task retrieved successfully"
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params;
    const {title, description, dueDate, priority, status} = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            title: title || task.title,
            description: description || task.description,
            dueDate: dueDate || task.dueDate,
            priority: priority || task.priority,
            status: status || task.status
        },
        {new: true}
    ).populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

    if (!updatedTask) {
        throw new ApiError(500, "Failed to update task");
    }

    return res.
    status(200).
    json(
        new ApiResponse(200, updatedTask),
        "Task updated successfully"
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    await Task.findByIdAndDelete(taskId);   
    return res.
    status(200).
    json(
        new ApiResponse(200, null),
        "Task deleted successfully"
    );
});

export{
    addTask,
    getTaskById, 
    updateTask,
    deleteTask
}