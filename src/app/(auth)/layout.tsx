import { auth } from "@/auth";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="relative min-h-screen flex flex-col-reverse sm:flex-row">
      <section className="my-auto flex h-full sm:min-h-screen flex-1 items-center bg-pattern bg-cover bg-top bg-dark-100 px-5 py-10">
        <div className="gradient-vertical mx-auto flex max-w-xl flex-col gap-6 rounded-lg p-10">
          <div className="flex flex-row gap-3">
            <BookOpen width={37} height={37} />
            <h1 className="text-2xl font-semibold text-white">AppName</h1>
          </div>
          <div>{children}</div>
        </div>
      </section>
      <section className="sticky h-40 w-full hidden md:block sm:top-0 sm:h-screen sm:flex-1">
        <Image
          src={"/images/pattern.webp"}
          alt="Auth img"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </div>
  );
};

export default Layout;
