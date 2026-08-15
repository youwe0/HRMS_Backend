import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 10,
    },
    description: { type: String, trim: true, maxlength: 500 },
    head: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export default mongoose.model("Department", departmentSchema);
