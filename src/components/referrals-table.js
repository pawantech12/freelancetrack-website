"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";

export function ReferralsTable({ referrals, loading }) {
  const [deleteReferralId, setDeleteReferralId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle delete confirmation
  const handleDelete = async () => {
    if (!deleteReferralId) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/referrals/${deleteReferralId}`);
      if (response.data.success) {
        toast.success("Referral deleted successfully!");
        window.location.reload(); // Refresh page after deletion
      } else {
        toast.error("Failed to delete Referral.");
      }
    } catch (error) {
      console.error("Error deleting referral:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsDeleting(false);
      setDeleteReferralId(null);
    }
  };
  return (
    <div className="mx-auto ">
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile No.</TableHead>
                  <TableHead>Commission(%)</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading ? (
                  referrals.length > 0 ? (
                    referrals.map((referral) => (
                      <TableRow key={referral._id}>
                        <TableCell>{referral.referrerName}</TableCell>
                        <TableCell>
                          {referral.referrerEmail
                            ? referral.referrerEmail
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {referral.referrerMobile
                            ? referral.referrerMobile
                            : "-"}
                        </TableCell>

                        <TableCell>{referral.commissionRate}</TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigator.clipboard.writeText(referral._id)
                                }
                              >
                                Copy referral ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/referrals/edit/${referral._id}`}>
                                  Edit referral
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>View projects</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  setDeleteReferralId(referral._id)
                                }
                              >
                                Delete Referral
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No referrals found.
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Confirmation Modal */}
      <Dialog
        open={!!deleteReferralId}
        onOpenChange={() => setDeleteReferralId(null)}
      >
        <DialogContent>
          <DialogHeader>Are you sure?</DialogHeader>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The Referral will be permanently
            deleted.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteReferralId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
