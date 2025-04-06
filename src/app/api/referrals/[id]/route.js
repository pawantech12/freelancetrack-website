import dbConnect from "@/app/lib/db.connect";
import Referral from "@/app/models/referral";
import { auth } from "@clerk/nextjs/server";

// UPDATE referral
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { userId } = await auth();
    const id = await params.id;
    const { referrerName, referrerEmail, referrerMobile, commissionRate } =
      await req.json();

    const updatedReferral = await Referral.findOneAndUpdate(
      { _id: id, userId },
      {
        referrerName,
        referrerEmail,
        referrerMobile,
        commissionRate,
      },
      { new: true }
    );

    if (!updatedReferral) {
      return Response.json(
        { success: false, message: "Referral not found or unauthorized" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, updatedReferral }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE referral
export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { userId } = await auth();
    const id = await params.id;

    const deletedReferral = await Referral.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedReferral) {
      return Response.json(
        { success: false, message: "Referral not found or unauthorized" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Referral deleted successfully" },
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

    const referral = await Referral.findOne({ _id: id, userId });

    if (!referral) {
      return Response.json(
        { success: false, message: "Referral not found or unauthorized" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, referral }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
