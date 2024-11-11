import cloudinaryInstance from '../config/cloud.config.js'; // Import the Cloudinary configuration

// const uploadToCloudinary = (req, res, next) => {
//     if (!req.file) {
//         return next(); // No file to upload, move to next middleware
//     }

//     // Upload file to Cloudinary
//     const uploadStream = cloudinaryInstance.uploader.upload_stream(
//         { folder: 'user_profiles' }, // Folder to store profile pictures
//         (error, result) => {
//             if (error) {
//                 return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
//             }
//             // Add the Cloudinary URL to the request object for further handling
//             req.file.avatarURL = result.secure_url;
//             next();
//         }
//     );
//     // Pass the file buffer from multer to Cloudinary upload stream
//     uploadStream.end(req.file.buffer);
// }
// export default uploadToCloudinary;

const uploadToCloudinary = (folder = 'default_folder', fieldName = 'imageURL') => {
    return (req, res, next) => {
        if (!req.file) {
            return next(); // No file to upload, move to next middleware
        }

        // Upload file to Cloudinary
        const uploadStream = cloudinaryInstance.uploader.upload_stream(
            { folder },
            (error, result) => {

                if (error) {
                    return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
                }

                req.file[fieldName] = result.secure_url;
                next();
            }
        );

        // Pass the file buffer from multer to Cloudinary upload stream
        uploadStream.end(req.file.buffer);
    };
};

export default uploadToCloudinary;

