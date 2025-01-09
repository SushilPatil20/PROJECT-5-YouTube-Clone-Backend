import express from "express"
import cors from "cors"
import userRoutes from "./routes/user.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import passport from "passport";
import authRoutes from "./routes/auth.routes.js";
const app = express();


const allowedOrigins = [
    'https://project-5-you-tube-clone-frontend.vercel.app',  // production
    'https://project-5-you-tube-clone-frontend-ndpvj1r65.vercel.app',  // preview deployments
];

app.use(express.urlencoded({ extended: true }));

// Allow requests from your frontend
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}))

app.use(express.json())
app.use(passport.initialize());



app.use('/api/auth', authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/channel", channelRoutes)
app.use("/api/video", videoRoutes)
app.use("/api/comment", commentRoutes)

export default app