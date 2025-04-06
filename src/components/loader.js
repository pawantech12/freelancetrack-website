"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <Card className="p-6 shadow-md border border-gray-200 max-w-sm w-full rounded-2xl transition-all duration-300">
        <CardContent className="flex flex-col items-center gap-5">
          <div className="bg-primary/10 p-4 rounded-full">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-medium text-primary">Loading...</h2>
            <p className="text-sm text-muted-foreground">
              Fetching details. Please wait.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
