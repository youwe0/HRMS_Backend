import { Router } from "express";
import config from "../config/index.js";
import authRoutes from "./auth.routes.js";
import employeeRoutes from "./employee.routes.js";
import departmentRoutes from "./department.routes.js";
import userRoutes from "./user.routes.js";
import designationRoutes from "./designation.routes.js";
import leaveTypeRoutes from "./leaveType.routes.js";
import resourceBundleRoutes from "./resourceBundle.routes.js";
import userDetailRoutes from "./userDetail.routes.js";
import companyMasterConfigRoutes from "./companyMasterConfig.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/users", userRoutes);
router.use("/designations", designationRoutes);
router.use("/leave-types", leaveTypeRoutes);
router.use("/", resourceBundleRoutes);
router.use("/userDetail", userDetailRoutes);
router.use("/company-master-config", companyMasterConfigRoutes);

export default router;
