import dbConnect from "@/app/lib/db.connect";
import Testimonial from "@/app/models/testimonial";
import { auth } from "@clerk/nextjs/server";

// Create New Testimonial
export async function POST(req) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const { clientName, projectName, rating, review, date } = await req.json();

    const testimonial = new Testimonial({
      userId,
      clientName,
      projectName,
      rating,
      review,
      date,
    });
    await testimonial.save();

    return Response.json({ success: true, testimonial }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Fetch Testimonials
export async function GET(req) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const testimonials = await Testimonial.find({ userId }).sort({
      createdAt: -1,
    });
    return Response.json({ success: true, testimonials }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
