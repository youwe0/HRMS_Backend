import { Router } from "express";
import config from "../config/index.js";
import authRoutes from "./auth.routes.js";
import employeeRoutes from "./employee.routes.js";
import departmentRoutes from "./department.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/users", userRoutes);

export default router;
