import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    mobile: { type: String },

    projectsCount: { type: String, default: 0 },
    totalSpent: { type: String, default: 0 },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
export default Client;
