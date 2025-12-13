import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center mt-40 px-6">
      <div className="bg-slate-900 shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Purchase Successful 🎉</h1>
        <p className="text-slate-400 mb-6">
          Thank you for your purchase! Your payment has been processed
          successfully.
        </p>
        <div className="flex flex-col gap-3">
          <Link href={`/books/${id}`}>
            <Button className="w-full">Go back</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
