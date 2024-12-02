// -------------------------- Define constants for file size and allowed file types --------------------------
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

// -------------------------- Middleware to validate uploaded images --------------------------
const validateImage = (req, res, next) => {
    try {
        // -------------------------- Loop through each uploaded file --------------------------
        for (let key in req.files) {
            const { mimetype } = req.files[key]?.[0]; // Get the mimetype of the file
            const image = mimetype.split("/")[0]; // Extract the image type (e.g., "image")

            // -------------------------- Check if the file is an image --------------------------
            if (image === "image") {
                const imageFile = req.files[key]?.[0]; // Get the image file

                // -------------------------- Check if image file exists --------------------------
                if (imageFile) {
                    // -------------------------- Validate file type --------------------------
                    if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
                        return res.status(400).json({ error: `Invalid image format for ${key}` }); // Reject if file format is invalid
                    }

                    // -------------------------- Validate file size --------------------------
                    if (imageFile.size > MAX_FILE_SIZE) {
                        return res.status(400).json({ error: `Image file for ${key} is too large` }); // Reject if file is too large
                    }
                } else {
                    console.log(`No image file uploaded for key: ${key}`); // Log if no file was uploaded
                }
            }
        }
        // -------------------------- Proceed to next middleware --------------------------
        return next();
    } catch (error) {
        // -------------------------- Handle any errors during validation --------------------------
        console.error("Error in validateImage middleware:", error); // Log the error
        return res.status(500).json({ error: "An error occurred while processing the image upload" }); // Send error response
    }
};

// -------------------------- Export the middleware for use in routes --------------------------
export default validateImage;
