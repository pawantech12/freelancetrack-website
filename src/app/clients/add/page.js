"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function AddClientPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/clients", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        toast.success("Client Added successfully!");
        router.push("/clients"); // Redirect after successful submission
      } else {
        toast.error("Failed to add client: " + response.data.error);
      }
    } catch (error) {
      toast.error("Failed to add client. Please try again.");
    }
  };

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label>Name</label>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="Client Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label>Email (Optional)</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Client Email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Mobile Number (Optional)</label>
              <Input
                {...register("mobile")}
                type="tel"
                placeholder="Mobile Number"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Number of Projects</label>
              <Input
                {...register("projectsCount", { valueAsNumber: true })}
                type="text"
                placeholder="Projects Count"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Total Spent</label>
              <Input
                {...register("totalSpent", { valueAsNumber: true })}
                type="text"
                placeholder="Total Spent ($)"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add Client"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
