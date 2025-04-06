"use client";

import { useState } from "react";
import { Star, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";

export function TestimonialsGrid({ testimonials }) {
  const [filter, setFilter] = useState(null);

  const filteredTestimonials = filter
    ? testimonials.filter((t) => t.rating === filter)
    : testimonials;

  const [deleteTestimonialId, setDeleteTestimonialId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle delete confirmation
  const handleDelete = async () => {
    if (!deleteTestimonialId) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `/api/testimonials/${deleteTestimonialId}`
      );
      if (response.data.success) {
        toast.success("Testimonial deleted successfully!");
        window.location.reload(); // Refresh page after deletion
      } else {
        toast.error("Failed to delete Testimonial.");
      }
    } catch (error) {
      console.error("Error deleting Testimonial:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsDeleting(false);
      setDeleteTestimonialId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 max-sm:flex-col max-sm:items-start overflow-auto">
        <div className="text-sm font-medium">Filter by rating:</div>
        <div className="flex items-center gap-2 max-sm:w-[400px] ">
          <Button
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filter === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(rating)}
            >
              {rating} ★
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial._id} className="overflow-hidden gap-0">
            <CardContent className="px-6 py-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link href={`/testimonials/edit/${testimonial._id}`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteTestimonialId(testimonial._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground italic">
                  &quot;{testimonial.review}&quot;
                </p>

                <div>
                  <div className="font-medium">{testimonial.clientName}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3 mt-0">
              <div className="text-xs text-muted-foreground">
                Project: {testimonial.projectName} •
                {new Date(testimonial.date).toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No testimonials found with the selected rating.
          </p>
        </div>
      )}
      {/* Confirmation Modal */}
      <Dialog
        open={!!deleteTestimonialId}
        onOpenChange={() => setDeleteTestimonialId(null)}
      >
        <DialogContent>
          <DialogHeader>Are you sure?</DialogHeader>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The Testimonial will be permanently
            deleted.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTestimonialId(null)}
            >
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
