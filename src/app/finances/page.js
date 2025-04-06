"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialOverview } from "@/components/financial-overview";
import { FinancialTable } from "@/components/financial-table";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FinancesPage() {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/financestats"); // Replace with your actual API endpoint
        setData(response.data.stats); // Assuming API returns correctly formatted data
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, []);
  return (
    <div className="px-20 py-10 max-lg:px-10 max-md:px-6 max-sm:px-4">
      <h1 className="text-3xl max-sm:text-2xl font-bold mb-6">Finances</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">
              Financial Overview
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Track your revenue and project finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialOverview data={data} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <TabsList className="w-full sm:w-auto flex-wrap">
              <TabsTrigger value="all" className="cursor-pointer">
                All Projects
              </TabsTrigger>
              <TabsTrigger value="direct" className="cursor-pointer">
                Direct Projects
              </TabsTrigger>
              <TabsTrigger value="referral" className="cursor-pointer">
                Referral Projects
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">
                  All Projects
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Financial details for all your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialTable
                  projects={projects}
                  type="all"
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="direct">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">
                  Direct Projects
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Financial details for projects you handled directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialTable
                  projects={projects}
                  type="direct"
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referral">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">
                  Referral Projects
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Financial details for projects referral to other developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialTable
                  projects={projects}
                  type="referral"
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
