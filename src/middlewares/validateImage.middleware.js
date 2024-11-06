const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/png'];


const validateImage = (req, res, next) => {
    const errors = [];
    if (req.file) {
        const { mimetype, size } = req.file;

        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
            errors.push('Invalid file type. eg jpg, jpeg, png');
        }

        // Check file size
        if (size > MAX_FILE_SIZE) {
            errors.push('File is too large. Maximum allowed size is 5MB.');
        }
    }
    else {
        return next()
    }


    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next(); // All validations passed, proceed to next middleware
};

export default validateImage;
