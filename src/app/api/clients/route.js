import dbConnect from "@/app/lib/db.connect";
import Client from "@/app/models/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  await dbConnect();
  try {
    const { userId } = await auth();
    console.log(userId);

    const { name, email, mobile, projectsCount, totalSpent } = await req.json();
    console.log(name, email, mobile, projectsCount, totalSpent);

    const client = new Client({
      name,
      email,
      mobile,
      projectsCount,
      totalSpent,
      userId,
    });
    await client.save();

    return Response.json(
      { success: true, message: "Client added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await dbConnect();
  try {
    const { userId } = await auth();

    const clients = await Client.find({ userId });
    if (!clients) {
      return Response.json(
        { success: false, message: "Clients not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, clients }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
