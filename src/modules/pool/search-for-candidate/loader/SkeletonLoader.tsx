import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-12 space-y-2 text-xs">
      <div className="col-span-2 pt-2">
        <Skeleton className="h-9 w-24 radiant-loading" />
      </div>

      <div className="col-span-10">
        <Skeleton className="p-2 rounded-md h-16 radiant-loading" />
      </div>
    </div>
  );
}
