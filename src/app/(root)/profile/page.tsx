import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <form
      action={async () => {
        "use server";

        await signOut();
      }}
      className="mb-10"
    >
      <Button variant={"destructive"}>Logout</Button>
    </form>
  );
};

export default page;
