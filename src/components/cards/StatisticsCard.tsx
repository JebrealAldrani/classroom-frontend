import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const StatisticsCard = ({ label, count, badgeText, loading }) => {
  const renderCount = (count: number) => (
    <p className="text-4xl font-semibold">{loading ? "..." : count}</p>
  );
  return (
    <Card className="">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-5 w-25 rounded-lg" />
        ) : (
          <CardTitle>{label}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-10 w-13 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded-lg" />
          </>
        ) : (
          <>
            {renderCount(count)}
            <Badge>{badgeText} </Badge>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
