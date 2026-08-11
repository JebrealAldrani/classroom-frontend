import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import { Class } from "@/types";
import { Skeleton } from "../ui/skeleton";

type props = {
  classes: Class[];
  loading: boolean;
};

const SubjectsBarChart = ({ classes, loading }: props) => {
  const chartConfig = {
    count: {
      label: "classes",
      color: "var(--chart-1)",
    },
  };

  const classesBySubject = classes.reduce<Record<string, number>>(
    (acc, item) => {
      const name = item.subject?.name ?? "Unknown subject";
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const topSubjects = Object.entries(classesBySubject)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const topSubjectsChartData = topSubjects.map(({ name, count }) => ({
    subject: name,
    count,
  }));
  return (
    <Card className="h-full col-span-1 lg:col-span-2">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-5 w-25 rounded-lg" />
        ) : (
          <CardTitle>Top subjects by class count</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-72 sm:h-80 md:h-88 lg:h-96">
          <ChartContainer
            config={chartConfig}
            className="min-h-50 h-full w-full"
          >
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <BarChart accessibilityLayer data={topSubjectsChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="subject"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    typeof value === "string" ? value.split(" ")[0] : value
                  }
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectsBarChart;
