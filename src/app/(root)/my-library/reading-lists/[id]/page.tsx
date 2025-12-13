import SeeReadingListPage from "@/components/my-library/reading-list/SeeReadingListPage";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <SeeReadingListPage id={id} />;
};

export default Page;
