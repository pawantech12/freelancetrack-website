import dbConnect from "@/app/lib/db.connect";
import Testimonial from "@/app/models/testimonial";
import { auth } from "@clerk/nextjs/server";

// Update Testimonial
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const id = await params.id;
    const { clientName, projectName, rating, review, date } = await req.json();

    const updatedTestimonial = await Testimonial.findOneAndUpdate(
      { _id: id, userId },
      { clientName, projectName, rating, review, date },
      { new: true }
    );

    return Response.json(
      { success: true, updatedTestimonial },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Delete Testimonial
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const id = await params.id;

    await Testimonial.findOneAndDelete({ _id: id, userId });
    return Response.json(
      { success: true, message: "Testimonial deleted" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const id = await params.id;

    const testimonial = await Testimonial.findOne({ _id: id, userId });

    if (!testimonial) {
      return Response.json({ success: false, testimonial }, { status: 404 });
    }
    return Response.json({ success: true, testimonial }, { status: 200 });
  } catch (error) {}
}
