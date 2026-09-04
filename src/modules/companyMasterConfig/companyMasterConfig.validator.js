import Joi from "joi";

export const upsertCompanyMasterConfigSchema = Joi.object({
  moduleName: Joi.string().trim().min(1).max(200).required(),
  basedOn: Joi.string().trim().min(1).max(200).required(),
});
