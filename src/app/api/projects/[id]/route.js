import Project from "@/app/models/project";
import dbConnect from "@/app/lib/db.connect";
import { auth } from "@clerk/nextjs/server";

// Update Project
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await auth();
    const projectId = await params.id;
    const {
      name,
      description,
      clientName,
      budget,
      type,
      referralName,
      commissionPrice,
      status,
      deadline,
    } = await req.json();

    const project = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      {
        name,
        description,
        clientName,
        budget,
        type,
        referralName,
        commissionPrice,
        status,
        deadline,
      },
      { new: true }
    );

    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, project }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Delete Project
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await auth();

    const projectId = await params.id;
    const project = await Project.findOneAndDelete({ _id: projectId, userId });

    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Project deleted" },
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

    const projectId = await params.id;
    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, project }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
