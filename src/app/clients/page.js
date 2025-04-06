"use client";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientsTable } from "@/components/clients-table";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/clients");
        setClients(response.data.clients);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientsData();
  }, []);

  return (
    <div className="py-10 px-20 max-sm:px-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl max-sm:text-2xl font-bold">Clients</h1>
        <Link href="/clients/add">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </Link>
      </div>

      <ClientsTable clients={clients} loading={loading} />
    </div>
  );
}
