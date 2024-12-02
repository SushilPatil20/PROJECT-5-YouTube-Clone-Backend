// -------------------------- Define constants for video file size and allowed video types --------------------------
const MAX_VIDEO_FILE_SIZE = 10 * 1024 * 1024; // 50MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

// -------------------------- Middleware to validate uploaded video --------------------------
const validateVideo = (req, res, next) => {
    // -------------------------- Get the video file from request --------------------------
    const videoFile = req.files?.videoUrl?.[0];

    // -------------------------- Check if a video file exists --------------------------
    if (videoFile) {
        // -------------------------- Validate video file type --------------------------
        if (!ALLOWED_VIDEO_TYPES.includes(videoFile.mimetype)) {
            return res.status(400).json({ error: 'Invalid video format' }); // Reject if file type is invalid
        }

        // -------------------------- Validate video file size --------------------------
        if (videoFile.size > MAX_VIDEO_FILE_SIZE) {
            return res.status(400).json({ error: 'Video file is too large' }); // Reject if file size exceeds limit
        }
        // -------------------------- Proceed to next middleware if valid --------------------------
        return next();
    }
    // -------------------------- Proceed to next middleware if no video file --------------------------
    return next()
};

// -------------------------- Export the middleware for use in routes --------------------------
export default validateVideo;
