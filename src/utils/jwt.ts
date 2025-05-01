import { User } from "@entities/user";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifytoken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
