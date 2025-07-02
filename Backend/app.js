import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(cookieParser())

import userRouter from "./src/routes/user.routes.js";
import taskRouter from "./src/routes/task.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);



app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});
export {app};