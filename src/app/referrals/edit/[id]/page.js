"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import Loader from "@/components/loader";

export default function EditReferralPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch referral data
  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const response = await axios.get(`/api/referrals/${id}`);
        if (response.data.success) {
          setReferral(response.data.referral);
          Object.keys(response.data.referral).forEach((key) => {
            setValue(key, response.data.referral[key]);
          });
        } else {
          toast.error("Referral not found");
          router.push("/referrals");
        }
      } catch (error) {
        toast.error("Failed to load referral data.");
        router.push("/referrals");
      }
    };

    fetchReferral();
  }, [id, router, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/referrals/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Referral updated successfully!");
        router.push("/referrals");
      } else {
        toast.error("Failed to update referral: " + response.data.message);
      }
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!referral) {
    return <Loader />;
  }

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <Card>
        <CardHeader>
          <CardTitle>Edit Referral</CardTitle>
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
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? "Updating..." : "Update Referral"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
