"use client";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectsTable } from "@/components/projects-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProjectsTableSkeleton } from "@/components/project-table-skeleton";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data.projects);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);
  return (
    <div className="py-10 px-20 max-sm:px-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/add">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Manage all your projects in one place
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!loading ? (
            <ProjectsTable projects={projects} loading={loading} />
          ) : (
            <ProjectsTableSkeleton />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
