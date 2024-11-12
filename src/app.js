import express from "express"
import cors from "cors"
import userRoutes from "./routes/user.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import videoRoutes from "./routes/video.routes.js";
const app = express();

app.use(express.urlencoded({ extended: true }));

// Allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173' // Frontend URL
}))


app.use(express.json())
app.use("/api/user", userRoutes)
app.use("/api/channel", channelRoutes)
app.use("/api/video", videoRoutes)

export default app