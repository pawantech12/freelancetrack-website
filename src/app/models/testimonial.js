import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
export default Testimonial;
