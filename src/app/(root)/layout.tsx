import Header from "@/components/Header";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-black/30 bg-cover bg-top px-5 xs:px-10 md:px-16">
      <div className="w-full max-w-7xl xl:mx-auto">
        <Header session={session} />
        <div className="pb-16 h-full w-full">{children}</div>
      </div>
    </main>
  );
};

export default layout;
