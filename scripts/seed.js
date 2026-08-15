import { connectDB, disconnectDB } from "../src/db/connection.js";
import { User, Department } from "../src/models/index.js";
import { hashPassword } from "../src/utils/password.js";
import { ROLES } from "../src/constants/index.js";
import logger from "../src/utils/logger.js";

const seed = async () => {
  await connectDB();

  // ---- Admin user ----
  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL || "admin@hrms.com"
  ).toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@1234";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: await hashPassword(adminPassword),
      role: ROLES.ADMIN,
    });
    logger.info(`Admin user created: ${adminEmail}`);
  } else {
    logger.info(`Admin user already exists: ${adminEmail}`);
  }

  // ---- Default departments ----
  const departments = [
    {
      name: "Engineering",
      code: "ENG",
      description: "Software engineering and platform teams",
    },
    {
      name: "Human Resources",
      code: "HR",
      description: "People operations and talent",
    },
    {
      name: "Finance",
      code: "FIN",
      description: "Financial planning and accounting",
    },
  ];

  for (const dept of departments) {
    const exists = await Department.findOne({ code: dept.code });
    if (!exists) {
      await Department.create(dept);
      logger.info(`Department created: ${dept.name} (${dept.code})`);
    } else {
      logger.info(`Department already exists: ${dept.name} (${dept.code})`);
    }
  }

  await disconnectDB();
  logger.info("Seeding complete.");
};

seed().catch((err) => {
  logger.error("Seeding failed", { error: err.message, stack: err.stack });
  process.exit(1);
});
