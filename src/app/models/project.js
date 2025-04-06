import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk User ID
    name: { type: String, required: true },
    description: { type: String, required: true },
    clientName: { type: String, required: true },
    budget: { type: Number, required: true },
    type: { type: String, required: true, enum: ["direct", "referral"] },
    referralName: { type: String },
    commissionPrice: {
      type: Number,
      required: true,
    },
    status: { type: String, enum: ["pending", "completed"], required: true },
    deadline: { type: Date }, // Optional deadline field
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
