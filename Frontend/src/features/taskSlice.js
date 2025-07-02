import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks : null,
    singleTask: null
};

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        clearTasks: (state) => {
            state.tasks = null;
        },
        addTask: (state, action) => {
            if (state.tasks) {
                state.tasks.push(action.payload);
            } else {
                state.tasks = [action.payload];
            }
        },
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
        },
        setSingleTask: (state, action) => {
            state.singleTask = action.payload;
        },
        clearSingleTask: (state) => {
            state.singleTask = null;
        }
    }
});

export const {
    setTasks,
    clearTasks,
    addTask,
    updateTask,
    deleteTask,
    setSingleTask,
    clearSingleTask
} = taskSlice.actions;

export default taskSlice.reducer;