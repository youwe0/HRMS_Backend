import Joi from "joi";
import { paginationSchema } from "../../shared/utils/pagination.js";

export const createAnnouncementSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().min(1).max(5000).required(),
  type: Joi.string().trim().min(1).max(100).required(),
});

export const getAnnouncementsSchema = paginationSchema({ limit: 10 });
