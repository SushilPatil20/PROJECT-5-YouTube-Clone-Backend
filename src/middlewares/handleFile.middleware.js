import multer from "multer";

const upload = (filedName) => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage }).single(filedName);
    return upload;
}
export default upload;