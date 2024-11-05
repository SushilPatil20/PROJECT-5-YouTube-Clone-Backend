import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
// export const JWT_SECRET = process.env.JWT_SECRET;



// {
//   userId: "user01",
//   username: "JohnDoe",
//   email: "john@example.com",
//   password: "hashedPassword123",
//   avatar: "https://example.com/avatar/johndoe.png",
//   channels: ["channel01"],
//  }