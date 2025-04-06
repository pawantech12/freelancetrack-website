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

export function ClientsTable({ clients, loading }) {
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle delete confirmation
  const handleDelete = async () => {
    if (!deleteClientId) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/clients/${deleteClientId}`);
      if (response.data.success) {
        toast.success("Client deleted successfully!");
        window.location.reload(); // Refresh page after deletion
      } else {
        toast.error("Failed to delete Client.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsDeleting(false);
      setDeleteClientId(null);
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
                  <TableHead>Projects</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading ? (
                  clients.length > 0 ? (
                    clients.map((client) => (
                      <TableRow key={client._id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          {client.mobile ? client.mobile : "-"}
                        </TableCell>

                        <TableCell>{client.projectsCount}</TableCell>
                        <TableCell className="font-medium">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(client.totalSpent)}
                        </TableCell>
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
                                  navigator.clipboard.writeText(client._id)
                                }
                              >
                                Copy client ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/clients/edit/${client._id}`}>
                                  Edit client
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>View projects</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteClientId(client._id)}
                              >
                                Delete client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No clients found.
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
        open={!!deleteClientId}
        onOpenChange={() => setDeleteClientId(null)}
      >
        <DialogContent>
          <DialogHeader>Are you sure?</DialogHeader>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The Client will be permanently
            deleted.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteClientId(null)}>
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
