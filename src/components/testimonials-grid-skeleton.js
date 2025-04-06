"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded" />
              ))}
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>

          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />

          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}
