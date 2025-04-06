import dbConnect from "@/app/lib/db.connect";
import Project from "@/app/models/project";
import { auth } from "@clerk/nextjs/server";

// Create New Project
export async function POST(req) {
  await dbConnect();
  try {
    const { userId } = await auth();
    console.log(userId);

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

    const project = new Project({
      userId,
      name,
      description,
      clientName,
      budget,
      type,
      referralName,
      commissionPrice,
      status,
      deadline,
    });
    await project.save();

    return Response.json({ success: true, project }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Fetch Projects
export async function GET(req) {
  await dbConnect();
  try {
    const { userId } = await auth();
    console.log(userId);

    const projects = await Project.find({ userId });

    return Response.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
