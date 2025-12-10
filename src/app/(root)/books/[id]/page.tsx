import { auth } from "@/auth";
import SeeBookPage from "@/components/SeeBookPage";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();

  if (!session) return;

  return (
    <div className="pt-10 max-w-5xl w-full mx-auto">
      <SeeBookPage id={id} session={session} />
    </div>
  );
};

export default Page;
