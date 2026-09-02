import { asyncHandler, sendSuccess } from "../utils/index.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import { companyMasterConfigService } from "../services/index.js";

/**
 * POST /company-master-config
 * Upsert a CompanyMasterConfig record (create or update by module name).
 */
export const upsertCompanyMasterConfig = asyncHandler(async (req, res) => {
  const config = await companyMasterConfigService.upsertCompanyMasterConfig({
    moduleName: req.body.moduleName,
    basedOn: req.body.basedOn,
    userId: req.user.userId,
  });
  sendSuccess(
    res,
    HTTP_STATUS.CREATED,
    MESSAGES.COMPANY_MASTER_CONFIG_CREATED,
    { config },
  );
});

/**
 * GET /company-master-config
 * Get all active CompanyMasterConfig records.
 */
export const getAllCompanyMasterConfig = asyncHandler(async (req, res) => {
  const configs =
    await companyMasterConfigService.getAllCompanyMasterConfig();
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    MESSAGES.COMPANY_MASTER_CONFIG_RETRIEVED,
    { configs },
  );
});
