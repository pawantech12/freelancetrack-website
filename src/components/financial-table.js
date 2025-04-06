"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusVariants = {
  completed: "default",
  pending: "outline",
};

export function FinancialTable({ projects, type = "all", isLoading }) {
  const [sortedData, setSortedData] = useState([]);

  // Update sortedData when projects change
  useEffect(() => {
    setSortedData(projects);
  }, [projects]);

  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = () => {
    const sorted = [...sortedData].sort((a, b) =>
      sortOrder === "asc" ? a.budget - b.budget : b.budget - a.budget
    );
    setSortedData(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  // Filter projects based on the selected tab
  const filteredProjects =
    type === "all"
      ? sortedData
      : sortedData.filter((project) => project.type === type);
  return (
    <div className="overflow-x-auto rounded-md border bg-white shadow-sm p-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={handleSort}>
                Budget <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading ? (
            filteredProjects.length ? (
              filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.type === "direct" ? "default" : "secondary"
                      }
                    >
                      {project.type.charAt(0).toUpperCase() +
                        project.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(project.budget)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[project.status]}>
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No projects found.
                </TableCell>
              </TableRow>
            )
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
