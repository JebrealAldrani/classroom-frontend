import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ChartContainer } from "../ui/chart";
import { Skeleton } from "../ui/skeleton";

const ClassStatusPieChart = ({ classStatusCounts, loading }) => {
  const STATUS_COLORS = {
    active: "#22c55e",
    inactive: "#f59e0b",
    archived: "#ef4444",
    unknown: "#64748b",
  };

  const statusChartData = Object.entries(classStatusCounts).map(
    ([name, value]) => ({
      name,
      value,
      color:
        STATUS_COLORS[name as keyof typeof STATUS_COLORS] ??
        STATUS_COLORS.unknown,
    }),
  );
  return (
    <Card className="">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-5 w-25 rounded-lg" />
        ) : (
          <CardTitle>Class status</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center">
        <div className="h-72 sm:h-80 md:h-88 lg:h-96 w-full">
          <ChartContainer
            className="h-full w-full"
            config={{
              active: { color: STATUS_COLORS.active },
              inactive: { color: STATUS_COLORS.inactive },
              archived: { color: STATUS_COLORS.archived },
              unknown: { color: STATUS_COLORS.unknown },
            }}
          >
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 16, right: 16, left: 16, bottom: 32 }}>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="30%"
                    outerRadius="65%"
                    paddingAngle={4}
                    label={{
                      fill: "#ffffff",
                      fontSize: 10,
                    }}
                    labelLine={false}
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassStatusPieChart;
