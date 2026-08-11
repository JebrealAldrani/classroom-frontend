import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const CapacitySnapshot = ({
  loading,
  totalSeats,
  averageCapacity,
  activeClassesCount,
  totalClasses,
}) => {
  return (
    <Card className="space-y-4">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-5 w-25 rounded-lg" />
        ) : (
          <CardTitle>Capacity snapshot</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            {loading ? (
              <Skeleton className="h-4 w-[70%]" />
            ) : (
              <p className="text-sm text-muted-foreground">Total class seats</p>
            )}
            <p className="mt-2 text-3xl font-semibold">
              {loading ? (
                <Skeleton className="h-12 w-14" />
              ) : (
                totalSeats.toLocaleString()
              )}
            </p>
          </div>

          <div className="rounded-xl border border-border p-4">
            {loading ? (
              <Skeleton className="h-4 w-[70%]" />
            ) : (
              <p className="text-sm text-muted-foreground">Average capacity</p>
            )}
            <p className="mt-2 text-3xl font-semibold">
              {loading ? <Skeleton className="h-12 w-14" /> : averageCapacity}
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-border p-4 bg-muted">
          {loading ? (
            <Skeleton className="h-4 w-[70%]" />
          ) : (
            <p className="text-sm text-muted-foreground">Active class ratio</p>
          )}
          <p className="mt-2 text-2xl font-semibold">
            {loading || totalClasses === 0 ? (
              <Skeleton className="h-12 w-14" />
            ) : (
              `${Math.round((activeClassesCount / totalClasses) * 100)}%`
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacitySnapshot;
