import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/userSlice.js';
import taskReducer from '../features/taskSlice.js'

export const store = configureStore({
    reducer: {
        user: userReducer,
        task: taskReducer,
    },
});