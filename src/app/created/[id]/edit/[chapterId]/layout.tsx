import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-gray-100 px-5 xs:px-10 md:px-16">
      <div className="w-full max-w-7xl xl:mx-auto mt-24 sm:mt-20 pb-16 ">
        {children}
      </div>
    </main>
  );
};

export default layout;
