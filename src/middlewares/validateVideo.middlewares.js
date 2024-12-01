const MAX_VIDEO_FILE_SIZE = 10 * 1024 * 1024; // 50MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

const validateVideo = (req, res, next) => {
    const videoFile = req.files?.videoUrl?.[0];

    if (videoFile) {
        if (!ALLOWED_VIDEO_TYPES.includes(videoFile.mimetype)) {
            return res.status(400).json({ error: 'Invalid video format' });
        }

        if (videoFile.size > MAX_VIDEO_FILE_SIZE) {
            return res.status(400).json({ error: 'Video file is too large' });
        }
        return next();
    }
    return next()
};

export default validateVideo;
