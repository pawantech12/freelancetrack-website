"use client";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Folder,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentProjects } from "@/components/recent-projects";
import { RecentTestimonials } from "@/components/recent-testimonials";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTestimonials, setRecentTestimonials] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [statsRes, projectsRes, testimonialsRes] = await Promise.all([
          axios.get("/api/stats"),
          axios.get("/api/projects"),
          axios.get("/api/testimonials"),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }

        if (projectsRes.data.success) {
          setRecentProjects(projectsRes.data.projects);
        }

        if (testimonialsRes.data.success) {
          setRecentTestimonials(testimonialsRes.data.testimonials);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false); // Only runs after all 3 finish (success or error)
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Freelance Project Management
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track your projects, manage clients, and grow your freelance
                  business
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/projects">
                  <Button className="cursor-pointer">
                    View Projects
                    <ArrowRight className="ml-2 h-4 w-4 " />
                  </Button>
                </Link>
                <Link href="/clients">
                  <Button variant="outline" className="cursor-pointer">
                    View Clients
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className=" px-4 md:px-6 py-12">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Projects
                    </CardTitle>
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.totalProjects}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.projectGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Clients
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.activeClients}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.clientGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenue (Direct)
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(stats?.revenueDirect)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.directRevenueGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenue (Referral)
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(stats?.revenueReferral)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.referralRevenueGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          <div className="mt-8 flex justify-between gap-6 max-lg:flex-col">
            {loading ? (
              <>
                <Card className="w-[70%] max-lg:w-full p-4 space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-[350px] w-full" />
                </Card>
                <Card className="w-[40%] max-lg:w-full p-4 space-y-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </Card>
              </>
            ) : (
              <>
                <Card className="w-[70%] max-lg:w-full">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      Project status breakdown for the current month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Overview data={stats?.overviewData || []} />
                  </CardContent>
                </Card>
                <Card className="w-[40%] max-lg:w-full">
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>
                      Projects due in the next 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 overflow-auto">
                      {stats?.deadlinesData?.length > 0 ? (
                        stats.deadlinesData.map((project, index) => (
                          <div
                            key={index}
                            className="flex items-center max-[400px]:overflow-auto max-[500px]:w-[400px]"
                          >
                            <div className="flex items-center gap-2 mr-auto">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div className="font-medium ">{project.name}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {project.daysLeft}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No upcoming deadlines.
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href="/projects"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View all deadlines
                    </Link>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your recently updated projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <RecentProjects recentProjects={recentProjects} />
                )}
              </CardContent>
              <CardFooter>
                <Link
                  href="/projects"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View all projects
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Testimonials</CardTitle>
                <CardDescription>
                  Latest feedback from your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    ))}
                  </div>
                ) : recentTestimonials.length > 0 ? (
                  <RecentTestimonials recentTestimonials={recentTestimonials} />
                ) : (
                  <p className="text-center text-sm">No recent testimonials</p>
                )}
              </CardContent>
              <CardFooter>
                <Link
                  href="/testimonials"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View all testimonials
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
