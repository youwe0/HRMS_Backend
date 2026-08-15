import { connectDB } from "../db/connection.js";

export const initDatabase = async () => {
  await connectDB();
};
