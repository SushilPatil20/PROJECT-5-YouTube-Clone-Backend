import express from "express"
import userRoutes from "./routes/user.routes.js";
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json())

app.use("/api/user", userRoutes)

export default app