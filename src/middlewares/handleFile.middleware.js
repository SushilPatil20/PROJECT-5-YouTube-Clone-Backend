import multer from 'multer';

// Middleware to handle multiple files
const upload = (fields) => {
    const storage = multer.memoryStorage();
    return multer({
        storage,
    }).fields(fields);
};

export default upload