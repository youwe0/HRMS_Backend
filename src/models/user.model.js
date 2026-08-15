import mongoose from 'mongoose';
import { ROLES, ROLES_LIST } from '../constants/index.js';

const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
  {
    token: { type: String, required: true }, // sha256 hash of the refresh token
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false, minlength: 8, maxlength: 72 },
    role: { type: String, enum: ROLES_LIST, default: ROLES.EMPLOYEE, index: true },
    isActive: { type: Boolean, default: true, index: true },
    refreshTokens: { type: [refreshTokenSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
