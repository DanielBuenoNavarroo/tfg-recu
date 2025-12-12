import SeeChapters from "@/components/books/chapters/SeeChapters";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <SeeChapters id={id} />;
};

export default Page;
