# YouTube Clone (Backend)

This is the backend of the YouTube Clone application built with Node.js, Express, and MongoDB (MERN stack). It provides the API for user authentication, video management, comment management, and more. The backend includes features like JWT authentication, server-side validation, protected routes, file uploads using Cloudinary, and more.

---

## Features

- **Authentication & Authorization**:

  - JWT-based authentication for secure login and registration.
  - Protect routes using middleware to ensure only authorized users can access specific resources.
  - User profile management (creation, update, password hashing).

- **Video Management**:

  - Upload, edit, delete, and view videos with associated metadata (title, description, tags, etc.).
  - Protect video routes to ensure users can only manage their own videos.

- **Comment Management**:

  - Users can create, update, and delete their own comments on videos.
  - Comments are tied to user accounts for proper management.

- **Cloudinary Integration**:

  - File uploads are handled by Cloudinary for video and thumbnail storage.
  - Automatically validate file types and sizes.

- **Server-Side Validation**:

  - Use of validation libraries for user inputs, including registration, video metadata, and comment data.

- **Middleware**:
  - JWT authentication middleware for protecting routes.
  - Custom validation middleware for validating requests and ensuring data integrity.

---

## Tech Stack

- **Backend**:
  - Node.js (JavaScript runtime)
  - Express.js (Web framework)
  - MongoDB (NoSQL database)
  - Mongoose (MongoDB ODM)
  - JWT (JSON Web Tokens for authentication)
  - Cloudinary (Cloud file storage for video and thumbnail uploads)
- **Authentication & Authorization**:

  - JWT authentication with password hashing (using bcrypt).
  - Protected routes to ensure only authorized users can manage their videos, channels, and comments.

- **Validation**:
  - Server-side validation for inputs using `express-validator` and `joi`.

---

## Folder Structure

```plaintext
src/
├── config/        # Configuration files (e.g., database connection, Cloudinary config)
├── controllers/   # Functions to handle the logic for each route
├── middlewares/   # Custom middleware for protecting routes and validation
├── models/         # Mongoose models for User, Video, Channel, Comment, etc.
├── routes/         # Express route definitions
├── utils/          # Utility functions for handling common tasks
├── validations/    # Input validation logic for user inputs
└── app.js          # Main application file where the Express server is configured
```

## Installation

**To run the backend on your local machine, follow these steps:**

- **Clone this repository:**
  git clone https://github.com/yourusername/youtube-clone-backend.git

- **Navigate to the project directory:**
  cd youtube-clone-backend

- **Install the required dependencies:**
  npm install

- **Set up environment variables by creating a .env file in the root directory with the following:**
  MONGO_URI=your_mongo_connection_string
  JWT_SECRET=your_jwt_secret
  CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret

- **Run the server:**
  npm run dev

  The API will be available at http://localhost:8000.

  ## API Endpoints

**Authentication**

- **POST** /api/auth/register: Register a new user.
- **POST** /api/auth/login: Login with email and password to receive JWT token.

**Video Management**

- **POST** /api/videos: Upload a new video (protected).
- **GET** /api/videos: Get a list of all videos (public).
- **GET** /api/videos/:id: Get a specific video by ID (public).
- **PUT** /api/videos/:id: Edit video details (protected, own video only).
- **DELETE** /api/videos/:id: Delete a video (protected, own video only).

**Comment Management**

- **POST** /api/comments: Add a new comment to a video (protected).
- **PUT** /api/comments/:id: Edit an existing comment (protected, own comment only).
- **DELETE** /api/comments/:id: Delete a comment (protected, own comment only).

**Channel Management**

- **POST** /api/channels: Create a new channel (protected).
- **GET** /api/channels/:userId: Get all videos from a user’s channel (protected).

## Contributing

Contributions are welcome! If you'd like to improve the project, feel free to fork the repository, create a new branch, and submit a pull request. Please ensure that your changes are well-tested and that they don't break any existing functionality.

## Acknowledgements

- **Node.js** - JavaScript runtime for building the backend.
- **Express.js** - Web framework for handling API requests.
- **MongoDB** - NoSQL database for storing data.
- **Mongoose** - MongoDB Object Data Modeling (ODM) library.
- **JWT** - For secure user authentication and authorization.
- **Cloudinary** - For managing video and image uploads.
- **Bcrypt** - Password hashing and salting.
- **Joi** - For input validation.
