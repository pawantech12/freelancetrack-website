"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
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

export default function NewTestimonialPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientsAndProjects = async () => {
      setLoading(true);
      try {
        const [clientRes, projectRes] = await Promise.all([
          axios.get("/api/clients"),
          axios.get("/api/projects"),
        ]);

        if (clientRes.data.success) setClients(clientRes.data.clients);
        if (projectRes.data.success) setProjects(projectRes.data.projects);
      } catch (error) {
        console.log("Failed to load client and project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientsAndProjects();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/testimonials", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success("Testimonial added successfully!");
        router.push("/testimonials");
      } else {
        toast.error("Failed to add testimonial: " + response.data.error);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <Card>
        <CardHeader>
          <CardTitle>Add New Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Rating</label>
              <Select onValueChange={(value) => setValue("rating", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Rating" />
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
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {!loading ? (
                    clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client._id} value={client.name}>
                          {client.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="No clients found" disabled>
                        No clients found
                      </SelectItem>
                    )
                  ) : (
                    <SelectItem value="Loading..." disabled>
                      Loading...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Project Name</label>
              <Select onValueChange={(value) => setValue("projectName", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {!loading ? (
                    projects.length > 0 ? (
                      projects.map((project) => (
                        <SelectItem key={project._id} value={project.name}>
                          {project.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="No projects found" disabled>
                        No projects found
                      </SelectItem>
                    )
                  ) : (
                    <SelectItem value="Loading..." disabled>
                      Loading...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Review Date</label>
              <Input
                type="date"
                {...register("date", {
                  required: "Review date is required",
                })}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add Testimonial"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
