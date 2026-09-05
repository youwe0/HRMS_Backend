import { Router } from "express";
import config from "../shared/config/index.js";
import authRoutes from "../modules/auth/auth.routes.js";
import employeeRoutes from "../modules/employee/employee.routes.js";
import departmentRoutes from "../modules/department/department.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import designationRoutes from "../modules/designation/designation.routes.js";
import leaveTypeRoutes from "../modules/leaveType/leaveType.routes.js";
import resourceBundleRoutes from "../modules/resourceBundle/resourceBundle.routes.js";
import userDetailRoutes from "../modules/userDetail/userDetail.routes.js";
import companyMasterConfigRoutes from "../modules/companyMasterConfig/companyMasterConfig.routes.js";
import attendanceRoutes from "../modules/attendance/attendance.routes.js";
import permissionRoutes from "../modules/permission/permission.routes.js";

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
router.use("/attendance", attendanceRoutes);
router.use("/permissions", permissionRoutes);

export default router;
