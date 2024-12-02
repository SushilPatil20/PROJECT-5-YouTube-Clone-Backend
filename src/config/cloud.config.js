import cloudinary from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "./dotenv.config.js";

// ---------------- Initialize Cloudinary instance ----------------
const cloudinaryInstance = cloudinary.v2;

// ---------------- Configure Cloudinary with credentials from environment variables ----------------
cloudinaryInstance.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,    // Cloud name for Cloudinary
    api_key: CLOUDINARY_API_KEY,          // API key for Cloudinary
    api_secret: CLOUDINARY_API_SECRET,    // API secret for Cloudinary
});

// ---------------- Export the configured Cloudinary instance for use in other parts of the application ----------------
export default cloudinaryInstance;
