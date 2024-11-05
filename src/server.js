import { connectToDB } from './config/db.config.js';
import { PORT } from './config/dotenv.config.js';
import app from './app.js';
connectToDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});