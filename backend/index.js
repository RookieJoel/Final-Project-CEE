import express from "express";
import cors from "cors";

import ItemRoute from "/home/ubuntu/MyCourseMate/backend/src/routes/threadRoutes.js";
import MemberRoute from "/home/ubuntu/MyCourseMate/backend/src/routes/commentRoute.js";

const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/items", ItemRoute);
app.use("/members", MemberRoute);

export default app;
