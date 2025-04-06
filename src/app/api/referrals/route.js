import dbConnect from "@/app/lib/db.connect";
import Referral from "@/app/models/referral";
import { auth } from "@clerk/nextjs/server";

// CREATE Referral
export async function POST(req) {
  await dbConnect();

  try {
    const { userId } = await auth();
    const { referrerName, referrerEmail, referrerMobile, commissionRate } =
      await req.json();

    const referral = new Referral({
      referrerName,
      referrerEmail,
      referrerMobile,
      commissionRate,
      userId,
    });

    await referral.save();

    return Response.json(
      { success: true, message: "Referral created successfully", referral },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET all referrals for the user
export async function GET(req) {
  await dbConnect();

  try {
    const { userId } = await auth();

    const referrals = await Referral.find({ userId }).sort({ createdAt: -1 });

    return Response.json({ success: true, referrals }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
