import { adminSideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Home</h1>
      <div className="flex w-full justify-evenly">
        {adminSideBarLinks.map((link) => {
          return (
            <Link href={link.route} key={link.route}>
              <div
                className={cn(
                  "w-full flex flex-row items-center max-md:justify-center gap-2 rounded-lg px-5 py-3.5",
                  "hover:bg-slate-700"
                )}
              >
                <div className="relative">
                  <link.img color={"white"} size={25} />
                </div>
                <p
                  className={cn(
                    "border-slate-400",
                    "text-base font-medium max-md:hidden border-l-2 pl-2"
                  )}
                >
                  {link.text}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default page;
