import ReviewForm from "@/components/ReviewForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="max-w-3xl w-full flex flex-col items-center pt-10 mx-auto">
      <h1 className="text-5xl font-bold">ADD A REVIEW</h1>
      <p className="text-slate-300 text-md mt-2">Be heard by your author</p>
      <ReviewForm id={id} />
    </div>
  );
};

export default Page;
