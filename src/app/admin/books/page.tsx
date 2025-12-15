"use client"

import { Button } from "@/components/ui/button"
import { deleteAllChapters } from "@/lib/actions/chapters"

const page = () => {
  const deleteChaps = async () => {
    await deleteAllChapters()
  }
  return (
    <div className="w-full rounded-2xl bg-slate-900 p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">All Books</h2>
            <Button className="" onClick={deleteChaps}>Delete all chapters</Button>
        </div>
    </div>
  )
}

export default page