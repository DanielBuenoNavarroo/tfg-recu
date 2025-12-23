import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOutWithRedirect } from "@/lib/actions/auth";
import { ChevronRight, Clipboard, Cog, LogOut, User } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="select-none max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-10">Settings</h1>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">
          <div className="bg-slate-900/80 p-6 border rounded-md w-full">
            <div className="flex items-center gap-4">
              <User size={20} />
              <h1 className="font-semibold text-xl">ACCOUNT</h1>
            </div>
            <Button
              asChild
              className="w-full mt-6 flex items-center justify-between min-h-12 border"
              variant={"ghost"}
            >
              <Link href={""}>
                <p className="w-full">Edit profile</p>
                <div className="">
                  <ChevronRight size={18} />
                </div>
              </Link>
            </Button>
            <Button
              asChild
              className="w-full mt-4 flex items-center justify-between min-h-12 border"
              variant={"ghost"}
            >
              <Link href={""}>
                <p className="w-full">Account settings</p>
                <div className="">
                  <ChevronRight size={18} />
                </div>
              </Link>
            </Button>
          </div>
          <div className="bg-slate-900/80 p-6 border rounded-md w-full">
            <div className="flex items-center gap-4">
              <Cog size={20} />
              <h1 className="font-semibold text-xl">
                Premium{" "}
                <span className="text-red-500 text-xs">(comming soon)</span>
              </h1>
            </div>
            <Button
              asChild
              className="w-full mt-6 flex bg-slate-900! hover:bg-slate-900! opacity-80 items-center justify-between min-h-12 border"
              variant={"ghost"}
              disabled
            >
              <div>
                <p className="w-full">Manage memberships</p>
                <div className="">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Button>
            <Button
              asChild
              className="w-full mt-4 flex bg-slate-900! hover:bg-slate-900! opacity-80 items-center justify-between min-h-12 border"
              variant={"ghost"}
              disabled
            >
              <div>
                <p className="w-full">Manage groups</p>
                <div className="">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Button>
          </div>
        </div>
        <div className="bg-slate-900/80 p-6 border rounded-md w-full">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-xl">CHAEK-HON</h1>
          </div>
          <Button
            className="w-full mt-6 flex items-center justify-between min-h-12 border"
            variant={"ghost"}
          >
            Invite friends
            <Clipboard size={18} />
          </Button>
          <Button
            asChild
            className="w-full mt-4 flex items-center justify-between min-h-12 bg-slate-900! hover:bg-slate-900! opacity-80"
            variant={"outline"}
            disabled
          >
            <div className="">
              <p>
                About{" "}
                <span className="text-red-500 text-xs">(comming soon)</span>
              </p>
              <ChevronRight size={18} />
            </div>
          </Button>
          <Button
            asChild
            className="w-full mt-4 flex items-center justify-between min-h-12 bg-slate-900! hover:bg-slate-900! opacity-80"
            variant={"outline"}
            disabled
          >
            <div className="">
              <p>
                Manage memberships{" "}
                <span className="text-red-500 text-xs">(comming soon)</span>
              </p>
              <ChevronRight size={18} />
            </div>
          </Button>
        </div>
        <Separator className="mt-2 mb-2" />
        <form action={signOutWithRedirect} className="w-full">
          <Button
            variant={"destructive"}
            className="w-full text-base bg-red-700! hover:bg-red-500!"
            type="submit"
          >
            <LogOut /> Log out
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;
