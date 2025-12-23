"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthorRequest {
  id: string;
  userName: string;
  reason: string;
  status: string;
  createdAt: string;
}

const AuthorRequestsPage = () => {
  const [requests, setRequests] = useState<AuthorRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch("/api/become-author");
      const data = await res.json();
      if (data.success) setRequests(data.data);
    };
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const res = await fetch(`/api/become-author/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Author requests</h1>
      {requests.map((req) => (
        <div
          key={req.id}
          className="p-4 border rounded-md flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{req.userName}</p>
            <p className="text-sm text-slate-300">{req.reason}</p>
            <p
              className={cn(
                "text-xs text-red-200",
                req.status === "approved" && "text-green-200",
                req.status === "pending" && "text-yellow-200"
              )}
            >
              Status: {req.status}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => updateStatus(req.id, "approved")}
              disabled={req.status !== "pending"}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus(req.id, "rejected")}
              disabled={req.status !== "pending"}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthorRequestsPage;
