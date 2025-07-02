import Router from 'express';
import{
    addTask,
    getTaskById, 
    updateTask,
    deleteTask
} from '../controllers/task.controller.js';

import {verifyJWT} from '../middleware/auth.middleware.js';

const router = Router();

router.route("/add").post(verifyJWT, addTask)
router.route("/:taskId").get(verifyJWT, getTaskById)
router.route("/:taskId").patch(verifyJWT, updateTask)
router.route("/:taskId").delete(verifyJWT, deleteTask)

export default router;