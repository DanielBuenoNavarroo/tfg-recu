import { auth } from "@/auth";
import ReadPage from "@/components/read/ReadPage";

const page = async ({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) => {
  const { chapterId, id } = await params;
  const session = await auth();
  if (!session) return;
  return <ReadPage bookId={id} chapterId={chapterId} session={session} />;
};

export default page;
