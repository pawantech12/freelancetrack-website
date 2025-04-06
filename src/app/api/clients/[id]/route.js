import dbConnect from "@/app/lib/db.connect";
import Client from "@/app/models/client";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const id = await params.id;

    const client = await Client.findOneAndDelete({ _id: id, userId });

    if (!client) {
      return Response.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const id = await params.id;
    const { name, email, mobile, projectsCount, totalSpent } = await req.json();

    const client = await Client.findOneAndUpdate(
      { _id: id, userId },
      { name, email, mobile, projectsCount, totalSpent },
      { new: true }
    );

    if (!client) {
      return Response.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Client updated successfully" },
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

    const client = await Client.findOne({ _id: id, userId });

    if (!client) {
      return Response.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, client }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
