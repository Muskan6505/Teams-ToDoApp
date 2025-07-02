import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
        },
        description: {
            type: String,
        },
        dueDate: {
            type: Date,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Low',
        },
        status: {
            type: String,
            enum: ['ToDo', 'In Progress', 'Done'],
            default: 'ToDo',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { 
        timestamps: true 
    }
);


taskSchema.plugin(mongooseAggregatePaginate);
export const Task = mongoose.model('Task', taskSchema);