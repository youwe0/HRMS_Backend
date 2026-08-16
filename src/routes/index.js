import { Router } from "express";
import config from "../config/index.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

export default router;
