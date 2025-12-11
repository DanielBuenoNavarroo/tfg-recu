import TipTap from "@/components/editor/TipTap";

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) => {
  const { id, chapterId } = await params;
  return <TipTap chapterId={chapterId} />;
};

export default Page;
