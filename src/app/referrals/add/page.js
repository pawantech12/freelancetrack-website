"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function AddReferralPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/referrals", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Referral added successfully!");
        router.push("/referrals");
      } else {
        toast.error("Failed to add referral: " + response.data.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <Card>
        <CardHeader>
          <CardTitle>Add New Referral</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label>Referral Name</label>
              <Input
                {...register("referrerName", {
                  required: "Referral name is required",
                })}
                placeholder="Referral Name"
              />
              {errors.referrerName && (
                <p className="text-red-500 text-sm">
                  {errors.referrerName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label>Email (Optional)</label>
              <Input
                {...register("referrerEmail")}
                type="email"
                placeholder="Email"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Mobile (Optional)</label>
              <Input
                {...register("referrerMobile")}
                type="tel"
                placeholder="Mobile Number"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Commission Rate (%)</label>
              <Input
                {...register("commissionRate", {
                  required: "Commission rate is required",
                })}
                placeholder="e.g. 10%"
              />
              {errors.commissionRate && (
                <p className="text-red-500 text-sm">
                  {errors.commissionRate.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add Referral"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
