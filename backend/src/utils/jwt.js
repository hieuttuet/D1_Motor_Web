import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (user) =>
  jwt.sign({ id: user.user_id, username: user.user_name }, process.env.JWT_SECRET, {
    
    expiresIn: "1d",
  });
