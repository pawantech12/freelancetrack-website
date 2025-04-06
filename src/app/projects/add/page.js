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

export default function NewProjectPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchReferralName = watch("referralName");
  const watchBudget = watch("budget");
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [referralShow, setReferralShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientRes, referralRes] = await Promise.all([
          axios.get("/api/clients"),
          axios.get("/api/referrals"),
        ]);

        if (clientRes.data.success) {
          setClients(clientRes.data.clients);
        } else {
          console.log("Client not found");
        }

        if (referralRes.data.success) {
          setReferrals(referralRes.data.referrals);
        } else {
          console.log("Referrals not found");
        }
      } catch (error) {
        console.log("Failed to load client or referral data.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const selectedReferral = referrals.find(
      (ref) => ref.referrerName === watchReferralName
    );

    if (selectedReferral && watchBudget) {
      const commission = (
        (parseFloat(watchBudget) *
          parseFloat(selectedReferral.commissionRate)) /
        100
      ).toFixed(2);

      setValue("commissionPrice", commission);
    }
  }, [watchReferralName, watchBudget, referrals, setValue]);

  const selectedReferral = referrals.find(
    (ref) => ref.referrerName === watchReferralName
  );

  const calculatedCommission =
    watchBudget && selectedReferral
      ? (
          (parseFloat(watchBudget) *
            parseFloat(selectedReferral.commissionRate)) /
          100
        ).toFixed(2)
      : "";

  const onSubmit = async (data) => {
    try {
      // Convert commissionPrice to number if it exists
      if (data.commissionPrice) {
        data.commissionPrice = parseFloat(data.commissionPrice);
      }

      // Also convert budget to number if needed
      if (data.budget) {
        data.budget = parseFloat(data.budget);
      }

      console.log("Project Data:", data);

      const response = await axios.post("/api/projects", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Project created successfully!");
        router.push("/projects"); // Redirect after successful submission
      } else {
        toast.error("Failed to create project: " + response.data.error);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <h1 className="text-3xl font-bold mb-6 max-sm:text-2xl">
        Add New Project
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Project Name</label>
              <Input
                {...register("name", { required: "Project name is required" })}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Enter project description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
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
                      <SelectItem value="No client found" disabled>
                        No client found
                      </SelectItem>
                    )
                  ) : (
                    <SelectItem value="Loading..." disabled>
                      Loading...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.clientName && (
                <p className="text-red-500 text-xs">
                  {errors.clientName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label>Project Type</label>
              <Select
                onValueChange={(value) => {
                  setValue("type", value);
                  setReferralShow(value === "referral"); // 👈 conditionally show/hide
                }}
              >
                <SelectTrigger className="w-full border p-2 rounded">
                  <SelectValue placeholder="Select Client Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">
                    Direct (I will do the project)
                  </SelectItem>
                  <SelectItem value="referral">
                    Referral (Referred for commission)
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {referralShow && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium">
                    Referral Name
                  </label>
                  <Select
                    onValueChange={(value) => setValue("referralName", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Referral" />
                    </SelectTrigger>
                    <SelectContent>
                      {!loading ? (
                        referrals.length > 0 ? (
                          referrals.map((referral) => (
                            <SelectItem
                              key={referral._id}
                              value={referral.referrerName}
                            >
                              {referral.referrerName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="No referrals found" disabled>
                            No referrals found
                          </SelectItem>
                        )
                      ) : (
                        <SelectItem value="Loading..." disabled>
                          Loading...
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.referralName && (
                    <p className="text-red-500 text-xs">
                      {errors.referralName.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Budget</label>
              <Input
                {...register("budget", {
                  required: "Budget is required",
                })}
                placeholder="Enter Price"
              />
              {errors.budget && (
                <p className="text-red-500 text-xs">{errors.budget.message}</p>
              )}
            </div>

            {referralShow && (
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium">
                  Commission Price
                </label>
                <Input
                  type={""}
                  readOnly
                  value={calculatedCommission}
                  {...register("commissionPrice")}
                  placeholder="Enter Price"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">
                Project Status
              </label>
              <Select onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status.message}</p>
              )}
            </div>

            {/* Deadline Field*/}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Deadline</label>
              <Input type="date" {...register("deadline")} />
              {errors.deadline && (
                <p className="text-red-500 text-xs">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
