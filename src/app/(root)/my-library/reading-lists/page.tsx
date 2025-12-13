"use client";

import { Button } from "@/components/ui/button";
import { ReadingListType } from "@/db/selects";
import { getReadingLists } from "@/lib/actions/reading-lists";
import { ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [readingLists, setReadingLists] = useState<ReadingListType[]>([]);
  useEffect(() => {
    const getData = async () => {
      const listsResponse = await getReadingLists();

      if (listsResponse.success) {
        setReadingLists(listsResponse.data);

        console.log(listsResponse.data);
      }
    };

    getData();
  }, []);

  return (
    <div>
      {readingLists && readingLists.length > 0 ? (
        <div className="mt-10 space-y-4">
          {readingLists.map((rl, i) => (
            <Link
              href={`/my-library/reading-lists/${rl.id}`}
              key={rl.id}
              className="flex items-center justify-between border p-2 px-6 rounded-md hover:opacity-80 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="border p-1 px-2.5 rounded-md bg-slate-900">
                    {i + 1}
                  </div>
                  <List size={26} />
                </div>
                <div className="">
                  <p className="text-sm text-slate-300 font-bold">
                    {rl.bookCount && rl.bookCount > 0 ? rl.bookCount : "N/A"}
                    {" titles"}
                  </p>
                  <p className="text-md font-bold">{rl.name}</p>
                </div>
              </div>
              <ChevronRight />
            </Link>
          ))}
          <div className="flex items-center justify-center">
            <Button className="mt-20 w-full max-w-40" asChild>
              <Link href={"/my-library/reading-lists/create"}>
                Create a list
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          Nothing here yet.
          <Button className="mt-6">Create your first list</Button>
        </div>
      )}
    </div>
  );
};

export default Page;
