"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "sonner";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";

export default function EditTestimonialPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientRes, projectRes, testimonialRes] = await Promise.all([
          axios.get("/api/clients"),
          axios.get("/api/projects"),
          axios.get(`/api/testimonials/${id}`),
        ]);

        if (clientRes.data.success) setClients(clientRes.data.clients);
        if (projectRes.data.success) setProjects(projectRes.data.projects);
        if (testimonialRes.data.success) {
          setInitialData(testimonialRes.data.testimonial);
        }
      } catch (error) {
        console.log("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key === "date") {
          // Convert date to YYYY-MM-DD format
          setValue(
            "date",
            new Date(initialData.date).toISOString().split("T")[0]
          );
        } else {
          setValue(key, initialData[key]);
        }
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`/api/testimonials/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success("Testimonial updated successfully!");
        router.push("/testimonials");
      } else {
        toast.error("Failed to update testimonial: " + response.data.error);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <Card>
        <CardHeader>
          <CardTitle>Edit Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Rating</label>
              <Select onValueChange={(value) => setValue("rating", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={initialData.rating || "Select Rating"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Review</label>
              <Textarea
                {...register("review", { required: "Review is required" })}
                placeholder="Enter review content"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Client Name</label>
              <Select onValueChange={(value) => setValue("clientName", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={initialData.clientName || "Select Client"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Project Name</label>
              <Select onValueChange={(value) => setValue("projectName", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={initialData.projectName || "Select Project"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Review Date</label>
              <Input
                type="date"
                {...register("date", { required: "Review date is required" })}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Update Testimonial"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
