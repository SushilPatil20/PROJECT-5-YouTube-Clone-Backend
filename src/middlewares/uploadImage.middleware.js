import cloudinaryInstance from '../config/cloud.config.js'; // Import Cloudinary configuration

// -------------------------- Define a function to handle file uploads to Cloudinary --------------------------
const uploadToCloudinary = (folder = "default_folder") => {
    return async (req, res, next) => {

        // -------------------------- Helper function to upload files to Cloudinary --------------------------
        const uploadFile = (file, folder, resourceType) => {
            return new Promise((resolve, reject) => {

                // -------------------------- Create an upload stream to Cloudinary --------------------------
                const uploadStream = cloudinaryInstance.uploader.upload_stream(
                    {
                        folder, // -------------------------- Cloudinary folder where the file will be stored --------------------------
                        resource_type: resourceType, // -------------------------- Specify whether it's an image or video --------------------------
                    },
                    (error, result) => {
                        if (error) {
                            // -------------------------- Reject the promise if there's an error in uploading --------------------------
                            return reject(error);
                        }
                        // -------------------------- Resolve the promise with the secure URL of the uploaded file --------------------------
                        resolve(result.secure_url);
                    }
                );

                // -------------------------- End the stream by uploading the file buffer --------------------------
                uploadStream.end(file.buffer);
            });
        };

        try {
            // -------------------------- Loop through each file in the request (req.files) --------------------------
            for (let key in req.files) {
                const file = req.files[key]?.[0]; // -------------------------- Get the first file of each field --------------------------

                if (file) {
                    const mimetype = file.mimetype; // -------------------------- Get the MIME type of the file --------------------------
                    let resourceType;

                    // -------------------------- Determine the resource type based on MIME type --------------------------
                    if (mimetype.includes("image")) {
                        resourceType = 'image'; // -------------------------- Set as image if MIME type is an image --------------------------
                    } else if (mimetype.includes("video")) {
                        resourceType = 'video'; // -------------------------- Set as video if MIME type is a video --------------------------
                    } else {
                        // -------------------------- Return a 400 error if the file type is unsupported --------------------------
                        return res.status(400).json({ error: `Unsupported file type for ${key}` });
                    }

                    // -------------------------- Upload the file and store the Cloudinary URL in req.files --------------------------
                    req.files[key] = await uploadFile(file, folder, resourceType);
                }
            }

            // -------------------------- Proceed to the next middleware --------------------------
            next();

        } catch (error) {
            // -------------------------- Handle any errors during the upload process --------------------------
            return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
        }
    };
};

export default uploadToCloudinary; 
