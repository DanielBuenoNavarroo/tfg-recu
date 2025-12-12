import ReadPage from "@/components/read/ReadPage";

const page = async ({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) => {
  const { chapterId, id } = await params;
  return <ReadPage bookId={id} chapterId={chapterId} />;
};

export default page;
