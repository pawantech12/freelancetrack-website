"use client";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReferralsTable } from "@/components/referrals-table";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReferralsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/referrals");
        setReferrals(response.data.referrals);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferralsData();
  }, []);

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl max-sm:text-2xl font-bold">Referrals</h1>
        <Link href="/referrals/add">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Referrals
          </Button>
        </Link>
      </div>

      <ReferralsTable referrals={referrals} loading={loading} />
    </div>
  );
}
