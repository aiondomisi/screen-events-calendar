import { Skeleton } from "@/components/ui/skeleton";

export const CalendarSkeleton = () => (
  <div className="absolute inset-0 z-10 flex flex-col gap-3 bg-background">
    <div className="flex justify-between">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-9 w-64" />
    </div>
    <div className="grid flex-1 grid-cols-7 grid-rows-5 gap-2">
      {Array.from({ length: 35 }, (_, i) => (
        <Skeleton key={i} className="h-full w-full" />
      ))}
    </div>
  </div>
);
