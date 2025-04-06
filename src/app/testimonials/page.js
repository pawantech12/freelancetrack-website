"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialsGrid } from "@/components/testimonials-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { TestimonialsGridSkeleton } from "@/components/testimonials-grid-skeleton";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/testimonials");

        if (res.data.success) {
          setTestimonials(res.data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  return (
    <div className="py-10 px-20 max-sm:px-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl max-sm:text-2xl font-bold">Testimonials</h1>
        <Link href="/testimonials/add">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Testimonial
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {!loading ? (
            <TestimonialsGrid testimonials={testimonials} />
          ) : (
            <TestimonialsGridSkeleton />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
