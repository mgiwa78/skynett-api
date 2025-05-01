import Joi from "joi";

export const createUserValidation = Joi.object({
  firstName: Joi.string().max(255).required(),
  lastName: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(255).required(),
  address: Joi.string().max(255),
  otp: Joi.string().length(6),
  contactNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .allow(null, ""),
  isArchived: Joi.boolean(),
  status: Joi.boolean(),
  isVerified: Joi.boolean(),
  role: Joi.number().integer().required(),
});

export const updateUserValidation = Joi.object({
  firstName: Joi.string().max(255).optional(),
  lastName: Joi.string().max(255).optional(),
  email: Joi.string().email().max(255).optional(),
  password: Joi.string().min(8).max(255).optional(),
  address: Joi.string().max(255).optional(),
  otp: Joi.string().length(6).optional(),
  contactNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .allow(null, ""),
  isArchived: Joi.boolean().optional(),
  status: Joi.boolean().optional(),
  isVerified: Joi.boolean().optional(),
});

export const getUserByIdValidation = Joi.object({
  id: Joi.number().integer().required(),
});
