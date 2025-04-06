"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsTableSkeleton() {
  return (
    <div className="mx-auto grid gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white max-[500px]:flex-col"
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" /> {/* Project name */}
            <Skeleton className="h-3 w-full" /> {/* Client name */}
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-16" /> {/* Budget */}
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Menu */}
          </div>
        </div>
      ))}
    </div>
  );
}
