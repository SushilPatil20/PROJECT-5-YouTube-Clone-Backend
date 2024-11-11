import express from "express"
import cors from "cors"
import userRoutes from "./routes/user.routes.js";
import channelRoutes from "./routes/channel.routes.js";
const app = express();

app.use(express.urlencoded({ extended: true }));

// Allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173' // Frontend URL
}))

// app.use(cors({
//     origin: 'https://ddc0-2401-4900-5505-b70c-e136-4dae-a8ad-e329.ngrok-free.app'
// }))



app.use(express.json())

app.use("/api/user", userRoutes)
app.use("/api/channel", channelRoutes)


export default app