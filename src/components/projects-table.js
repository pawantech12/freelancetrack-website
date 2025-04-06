"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";

const statusMap = {
  pending: { label: "Pending", variant: "warning" }, // Yellow color for pending
  completed: { label: "Completed", variant: "success" }, // Green color for completed
};
export function ProjectsTable({ projects, loading }) {
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle delete confirmation
  const handleDelete = async () => {
    if (!deleteProjectId) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/projects/${deleteProjectId}`);
      if (response.data.success) {
        toast.success("Project deleted successfully!");
        window.location.reload(); // Refresh page after deletion
      } else {
        toast.error("Failed to delete project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsDeleting(false);
      setDeleteProjectId(null);
    }
  };
  return (
    <div className=" mx-auto">
      <div className="grid gap-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white max-[500px]:flex-col max-[500px]:items-start gap-3"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {project.name}
                </h3>
                <p className="text-xs text-gray-500">{project.clientName}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={statusMap[project.status]?.variant || "outline"}
                  >
                    {statusMap[project.status]?.label || project.status}
                  </Badge>
                  <Badge>{project.type}</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 max-[500px]:justify-between max-[500px]:w-full">
                <span className="text-sm font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(project.budget)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(project._id)}
                    >
                      Copy project ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/projects/edit/${project._id}`}>
                        Edit project
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteProjectId(project._id)} // Show modal
                    >
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center p-4 border rounded-lg shadow-sm bg-white">
            <p className="text-sm text-gray-500">No projects found.</p>
          </div>
        )}
      </div>
      {/* Confirmation Modal */}
      <Dialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
      >
        <DialogContent>
          <DialogHeader>Are you sure?</DialogHeader>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The project will be permanently
            deleted.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProjectId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
