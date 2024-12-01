const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const validateImage = (req, res, next) => {
    try {
        for (let key in req.files) {
            const { mimetype } = req.files[key]?.[0];
            const image = mimetype.split("/")[0];
            if (image === "image") {
                const imageFile = req.files[key]?.[0];
                if (imageFile) {
                    if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
                        return res.status(400).json({ error: `Invalid image format for ${key}` });
                    }

                    if (imageFile.size > MAX_FILE_SIZE) {
                        return res.status(400).json({ error: `Image file for ${key} is too large` });
                    }
                } else {
                    console.log(`No image file uploaded for key: ${key}`);
                }
            }
        }
        return next();
    } catch (error) {
        console.error("Error in validateImage middleware:", error);
        return res.status(500).json({ error: "An error occurred while processing the image upload" });
    }
};

export default validateImage;
