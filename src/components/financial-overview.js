"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "./ui/skeleton";

export function FinancialOverview({ data, isLoading }) {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="rounded-lg border p-4 flex flex-col gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-20" />
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-muted-foreground">
                  {idx === 0
                    ? "Total Revenue"
                    : idx === 1
                    ? "Direct Projects"
                    : "Referral Projects"}
                </div>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(
                    idx === 0
                      ? data.totalRevenue
                      : idx === 1
                      ? data.revenueDirect
                      : data.revenueReferral
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {idx === 0
                    ? `+${data.revenueGrowth}% from last year`
                    : idx === 1
                    ? `${data.revenueDirectPercentage}% of total revenue`
                    : `${data.revenueReferralPercentage}% of total revenue`}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-lg border p-4">
        <div className="text-sm font-medium mb-4">Revenue Over Time</div>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.chartData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="direct"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="referral"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
