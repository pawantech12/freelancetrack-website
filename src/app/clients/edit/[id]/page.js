"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "sonner";
import Loader from "@/components/loader";

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`/api/clients/${id}`);
        if (response.data.success) {
          setClient(response.data.client);
          Object.keys(response.data.client).forEach((key) => {
            setValue(key, response.data.client[key]);
          });
        } else {
          toast.error("Client not found");
          router.push("/clients");
        }
      } catch (error) {
        toast.error("Failed to load client data.");
        router.push("/clients");
      }
    };

    fetchClient();
  }, [id, router, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await axios.put(`/api/clients/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Client updated successfully!");
        router.push("/clients");
      } else {
        toast.error("Failed to update client: " + response.data.message);
      }
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return <Loader />;
  }

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <Card>
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
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
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? "Updating..." : "Update Client"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
