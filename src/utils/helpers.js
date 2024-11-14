import bcrypt from 'bcrypt';
import cloudinaryInstance from "../config/cloud.config.js"; // Import Cloudinary configuration



/**
 * Hashes a plain text password for secure storage in the database.
 * @param {String} password - The plain text password to be hashed.
 * @returns {Promise<String>} - A promise that resolves to the hashed password.
 */
export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};


/**
 * Compares a plain password with a hashed password.
 * @param {String} plainPassword - The plain text password provided by the user.
 * @param {String} hashedPassword - The hashed password stored in the database.
 * @returns {Boolean} - Returns true if passwords match, false otherwise.
 */
export const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error.message);
        return false;
    }
};


/**
 * Deletes a file from Cloudinary based on its URL.
 * @param {String} fileUrl - The URL of the file stored in Cloudinary.
 * @param {String} resourceType - The type of resource to delete (e.g., 'image', 'video').
 * @returns {Promise<Boolean>} - Returns true if deletion is successful, throws an error otherwise.
 * @throws {Error} - Throws an error if the file deletion fails.
 * @example
 * await deleteCloudinaryFile('http://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg', 'image');
 */
export const deleteCloudinaryFile = async (fileUrl = "", resourceType) => {
    if (fileUrl) {
        try {
            // Split the URL by '/' to locate the folder path and public ID
            const urlParts = fileUrl.split('/');

            // Extract the folder name and public ID
            const folderName = urlParts[urlParts.length - 2]; // Gets "videoFiles"
            const publicId = urlParts[urlParts.length - 1].split('.')[0]; // Gets "mosvk14q5kivixf51sln"

            // Construct the full public ID including the folder path
            const fullPublicId = `${folderName}/${publicId}`;

            // Perform deletion on Cloudinary using the constructed public ID
            const result = await cloudinaryInstance.uploader.destroy(fullPublicId, { resource_type: resourceType });

            return result.result === "ok";
        } catch (error) {
            console.error(`Error deleting ${resourceType} from Cloudinary:`, error.message);
            throw new Error(`Failed to delete ${resourceType} on Cloudinary.`);
        }
    }
};
