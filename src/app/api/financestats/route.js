import dbConnect from "@/app/lib/db.connect";
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

    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    const previousMonthStart = new Date();
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    previousMonthStart.setDate(1);

    const directRevenue = await Project.aggregate([
      { $match: { userId, type: "direct" } },
      { $group: { _id: null, total: { $sum: "$budget" } } },
    ]);
    const referralRevenue = await Project.aggregate([
      { $match: { userId, type: "referral" } },
      { $group: { _id: null, total: { $sum: "$commissionPrice" } } },
    ]);

    const lastMonthRevenue = await Project.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$budget" } } },
    ]);
    // Use direct + referral as total revenue
    const direct = directRevenue[0]?.total || 0;
    const referral = referralRevenue[0]?.total || 0;
    const total = direct + referral;

    const revenueGrowth =
      lastMonthRevenue.length > 0 && lastMonthRevenue[0].total > 0
        ? ((total - lastMonthRevenue[0].total) / lastMonthRevenue[0].total) *
          100
        : 0;

    const directPercentage =
      total > 0 ? ((direct / total) * 100).toFixed(1) : 0;
    const referralPercentage =
      total > 0 ? ((referral / total) * 100).toFixed(1) : 0;

    // Fetch projects
    const projects = await Project.find({ userId }).lean();

    const monthlyData = await Project.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          direct: {
            $sum: {
              $cond: [{ $eq: ["$type", "direct"] }, "$budget", 0],
            },
          },
          referral: {
            $sum: {
              $cond: [{ $eq: ["$type", "referral"] }, "$commissionPrice", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = monthlyData.map((entry) => ({
      month: new Date(0, entry._id - 1).toLocaleString("en", {
        month: "short",
      }),
      direct: entry.direct,
      referral: entry.referral,
    }));

    return Response.json(
      {
        success: true,
        stats: {
          totalRevenue: total,
          revenueGrowth: revenueGrowth.toFixed(1),
          revenueDirect: direct,
          revenueReferral: referral,
          revenueDirectPercentage: directPercentage,
          revenueReferralPercentage: referralPercentage,
          chartData: formattedData,
        },
        projects, // Add projects to response
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
