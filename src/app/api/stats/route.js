import dbConnect from "@/app/lib/db.connect";
import Client from "@/app/models/client";
import Project from "@/app/models/project";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  await dbConnect();

  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get current and previous month dates
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    const previousMonthStart = new Date();
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    previousMonthStart.setDate(1);

    // Get today's date and the date for the next 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Fetch total projects
    const totalProjects = await Project.countDocuments({ userId });

    // Fetch projects by status
    const completedProjects = await Project.countDocuments({
      userId,
      status: "completed",
    });

    const pendingProjects = await Project.countDocuments({
      userId,
      status: "pending",
    });

    // Prepare overview data
    const overviewData = [
      { name: "Completed", total: completedProjects },
      { name: "Pending", total: pendingProjects },
    ];

    // Fetch last month's projects
    const lastMonthProjects = await Project.countDocuments({
      userId,
      createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
    });

    // Fetch projects by type
    const directRevenue = await Project.aggregate([
      { $match: { userId: userId, type: "direct" } },
      { $group: { _id: null, total: { $sum: "$budget" } } },
    ]);
    const referralRevenue = await Project.aggregate([
      { $match: { userId: userId, type: "referral" } },
      { $group: { _id: null, total: { $sum: "$commissionPrice" } } },
    ]);

    // Get last month's revenue
    const lastMonthDirectRevenue = await Project.aggregate([
      {
        $match: {
          userId: userId,
          type: "direct",
          createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$budget" } } },
    ]);

    const lastMonthReferralRevenue = await Project.aggregate([
      {
        $match: {
          userId: userId,
          type: "referral",
          createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$commissionPrice" } } },
    ]);

    // Fetch total active clients
    const activeClients = await Client.countDocuments({ userId });

    // Fetch last month's clients
    const lastMonthClients = await Client.countDocuments({
      userId,
      createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
    });

    // Calculate growth percentages
    const projectGrowth =
      lastMonthProjects > 0
        ? ((totalProjects - lastMonthProjects) / lastMonthProjects) * 100
        : 0;
    const clientGrowth =
      lastMonthClients > 0
        ? ((activeClients - lastMonthClients) / lastMonthClients) * 100
        : 0;
    const directRevenueGrowth =
      lastMonthDirectRevenue.length > 0
        ? ((directRevenue[0]?.total || 0) - lastMonthDirectRevenue[0]?.total) /
          lastMonthDirectRevenue[0]?.total
        : 0;
    const referralRevenueGrowth =
      lastMonthReferralRevenue.length > 0
        ? ((referralRevenue[0]?.total || 0) -
            lastMonthReferralRevenue[0]?.total) /
          lastMonthReferralRevenue[0]?.total
        : 0;

    // Fetch upcoming deadlines (projects due in the next 7 days)
    const upcomingDeadlines = await Project.find({
      userId,
      deadline: { $gte: today, $lte: nextWeek },
    })
      .sort({ deadline: 1 })
      .limit(3)
      .select("name deadline");

    // Format deadline data
    const deadlinesData = upcomingDeadlines.map((project) => {
      const daysLeft = Math.ceil(
        (new Date(project.deadline) - today) / (1000 * 60 * 60 * 24)
      );
      return {
        name: project.name,
        daysLeft: `${daysLeft} days left`,
      };
    });

    return Response.json(
      {
        success: true,
        stats: {
          totalProjects,
          overviewData,
          deadlinesData,
          projectGrowth: projectGrowth.toFixed(1),
          activeClients,
          clientGrowth: clientGrowth.toFixed(1),
          revenueDirect: directRevenue[0]?.total || 0,
          directRevenueGrowth: (directRevenueGrowth * 100).toFixed(1),
          revenueReferral: referralRevenue[0]?.total || 0,
          referralRevenueGrowth: (referralRevenueGrowth * 100).toFixed(1),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
