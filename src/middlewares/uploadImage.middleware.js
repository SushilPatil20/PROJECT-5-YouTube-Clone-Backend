import cloudinaryInstance from '../config/cloud.config.js'; // Import Cloudinary configuration

const uploadToCloudinary = (folder = "default_folder") => {
    return async (req, res, next) => {
        const uploadFile = (file, folder, resourceType) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinaryInstance.uploader.upload_stream(
                    {
                        folder,
                        resource_type: resourceType,
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result.secure_url);
                    }
                );
                uploadStream.end(file.buffer);
            });
        };

        try {
            for (let key in req.files) {
                const file = req.files[key]?.[0];

                if (file) {
                    const mimetype = file.mimetype;
                    let resourceType;

                    if (mimetype.includes("image")) {
                        resourceType = 'image';
                    } else if (mimetype.includes("video")) {
                        resourceType = 'video';
                    } else {
                        return res.status(400).json({ error: `Unsupported file type for ${key}` });
                    }

                    req.files[key] = await uploadFile(file, folder, resourceType);
                }
            }

            next();

        } catch (error) {
            return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
        }
    };
};

export default uploadToCloudinary;
