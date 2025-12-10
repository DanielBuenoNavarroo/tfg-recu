import ChapterCreationPage from "@/components/chapter-creation/ChapterCreationPage";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ChapterCreationPage id={id} />;
};

export default Page;
