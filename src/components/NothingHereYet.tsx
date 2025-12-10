import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const NothingHereYet = ({ className }: Props) => {
  return (
    <div
      className={cn(
        className,
        "border border-slate-600 border-dashed rounded-md flex items-center justify-center w-full h-80 mt-4"
      )}
    >
      <p className="text-sm text-slate-400">Nothing here yet.</p>
    </div>
  );
};

export default NothingHereYet;
