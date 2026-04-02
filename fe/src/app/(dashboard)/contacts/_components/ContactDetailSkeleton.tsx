import { Skeleton } from "@/components/ui/skeleton";

export function ContactDetailSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <header className="h-14 shrink-0 border-b bg-background flex items-center justify-between px-6 gap-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-7 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="size-1 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[35%] min-w-75 bg-background border-r border-border flex flex-col overflow-y-auto shrink-0 px-5 py-6">
          <div className="flex justify-end mb-5">
            <Skeleton className="h-7 w-20 rounded-md" />
          </div>

          <div className="flex flex-col items-center gap-3 pb-5 border-b border-border">
            <Skeleton className="size-14 rounded-full" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          <div className="mt-6 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>

        <div className="flex-1 bg-[#F8F8F7] overflow-y-auto px-6 py-5">
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="grid grid-cols-4 gap-2 pb-3 border-b border-border">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-20 w-full mt-3" />
            <div className="flex justify-between mt-3">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-28" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
