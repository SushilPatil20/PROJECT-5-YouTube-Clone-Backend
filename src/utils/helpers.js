import bcrypt from "bcrypt"


export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

/**
 * Compares a plain password with a hashed password
 * @param {string} plainPassword - The plain text password provided by the user
 * @param {string} hashedPassword - The hashed password stored in the database
 * @returns {boolean} - Returns true if passwords match, false otherwise
 */
export const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords : ', error.message);
        return false;
    }
};
