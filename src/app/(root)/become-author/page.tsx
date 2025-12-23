"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { hasUserRequestedAuthor } from "@/lib/actions/auth";

const BecomeAuthorPage = () => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await hasUserRequestedAuthor();

      if (res) {
        redirect("/");
      }
    };

    getData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/become-author", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      toast.success("Request sended");
      setReason("");
      redirect("/");
    } else {
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-60 p-6 border rounded-md bg-slate-900/60">
      <h1 className="text-2xl font-bold mb-4">Become an Author</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          ¿Why you want to become an author?
        </label>
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Write why you want to become an author..."
        />
        <Button type="submit" className="w-full">
          Send
        </Button>
      </form>
    </div>
  );
};

export default BecomeAuthorPage;
