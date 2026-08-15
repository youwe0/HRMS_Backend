import mongoose from "mongoose";

const { Schema } = mongoose;

const EMPLOYEE_STATUS = ["active", "on-leave", "terminated"];

const employeeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    designation: { type: String, required: true, trim: true, maxlength: 100 },
    joiningDate: { type: Date, required: true },
    phone: { type: String, trim: true, maxlength: 20 },
    address: { type: String, trim: true, maxlength: 500 },
    salary: {
      currency: {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: 3,
        default: "USD",
      },
      amount: { type: Number, min: 0, default: 0 },
    },
    status: {
      type: String,
      enum: EMPLOYEE_STATUS,
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Employee", employeeSchema);
