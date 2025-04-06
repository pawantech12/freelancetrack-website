"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import Loader from "@/components/loader";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchReferralName = watch("referralName");
  const watchBudget = watch("budget");
  const [referrals, setReferrals] = useState([]);
  const [referralShow, setReferralShow] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/projects/${id}`);
        if (response.data.success) {
          setInitialData(response.data.project);
          setReferralShow(
            response.data.project.type === "referrer" ? true : false
          );
        } else {
          toast.error("Project not found");
          router.push("/projects");
        }
      } catch (error) {
        toast.error("Error fetching project");
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    }
    const fetchClient = async () => {
      try {
        const response = await axios.get(`/api/clients`);
        if (response.data.success) {
          setClients(response.data.clients);
        } else {
          console.log("Client not found");
        }
      } catch (error) {
        console.log("Failed to load client data.");
      }
    };
    const fetchReferrals = async () => {
      try {
        const response = await axios.get(`/api/referrals`);
        if (response.data.success) {
          setReferrals(response.data.referrals);
        } else {
          console.log("Referral not found");
        }
      } catch (error) {
        console.log("Failed to load Referral data.");
      }
    };
    fetchReferrals();
    fetchClient();
    fetchProject();
  }, [id]);

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

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key === "deadline") {
          // Convert date to YYYY-MM-DD format
          setValue(
            "deadline",
            new Date(initialData.deadline).toISOString().split("T")[0]
          );
        } else {
          setValue(key, initialData[key]);
        }
      });
    }
  }, [initialData, setValue]);

  console.log("initial data: ", initialData);

  const onSubmit = async (data) => {
    try {
      const updatedFields = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== initialData[key]) {
          acc[key] = data[key];
        }
        return acc;
      }, {});

      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes made.");
        return;
      }

      const response = await axios.put(`/api/projects/${id}`, updatedFields, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success("Project updated successfully!");
        router.push("/projects");
      } else {
        toast.error("Failed to update project: " + response.data.error);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <h1 className="text-3xl max-sm:text-2xl font-bold mb-6">Edit Project</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Project Name</label>
              <Input
                {...register("name", { required: "Project name is required" })}
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
                  <SelectValue
                    placeholder={initialData.clientName || "Select Client Name"}
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
              {errors.clientName && (
                <p className="text-red-500 text-xs">
                  {errors.clientName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label>Project Type</label>
              <Select onValueChange={(value) => setValue("type", value)}>
                <SelectTrigger className="w-full border p-2 rounded">
                  <SelectValue
                    placeholder={initialData.type || "Select Type"}
                  />
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
                {...register("budget", { required: "Budget is required" })}
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
                  <SelectValue
                    placeholder={initialData?.status || "Select status"}
                  />
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
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium">Deadline</label>
              <Input
                type="date"
                {...register("deadline", { required: "Deadline is required" })}
              />
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
              {isSubmitting ? "Updating..." : "Update Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
