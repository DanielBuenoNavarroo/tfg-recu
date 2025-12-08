import { auth } from "@/auth";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  return (
    <main className="min-h-screen w-full flex flex-row">
      <Sidebar session={session} />
      <div className="flex w-[calc(100%-264px)] flex-1 flex-col p-5 lg:pt-10 lg:pl-10 xs:p-10;">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};

export default layout;
