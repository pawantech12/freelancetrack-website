import mongoose from "mongoose";

const ReferralSchema = new mongoose.Schema(
  {
    referrerName: { type: String, required: true },
    referrerEmail: { type: String },
    referrerMobile: { type: String },
    commissionRate: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Referral ||
  mongoose.model("Referral", ReferralSchema);
