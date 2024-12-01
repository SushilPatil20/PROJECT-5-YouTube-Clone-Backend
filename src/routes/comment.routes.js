import express from "express"
import { createComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.js";
import authToken from "../middlewares/auth.middleware.js";

const commentRoutes = express.Router();

commentRoutes.post("/create", authToken, createComment)

commentRoutes.get("/get/:videoId", getComments)

commentRoutes.delete("/delete/:commentId", authToken, deleteComment)

commentRoutes.put('/update/:commentId', authToken, updateComment);

export default commentRoutes;
