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
import { User } from "@/types";
import { Skeleton } from "../ui/skeleton";

type props = {
  users: User[];
  loading: boolean;
};

const UserRolesPieChart = ({ users, loading }: props) => {
  const ROLE_COLORS = {
    student: "#2563eb",
    teacher: "#16a34a",
    admin: "#c2410c",
    unknown: "#64748b",
  };

  const userRoleCounts = users.reduce<Record<string, number>>((acc, user) => {
    const key = user.role ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const roleChartData = Object.entries(userRoleCounts).map(([name, value]) => ({
    name,
    value,
    color: ROLE_COLORS[name as keyof typeof ROLE_COLORS] ?? ROLE_COLORS.unknown,
  }));
  return (
    <Card className="">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-5 w-25 rounded-lg" />
        ) : (
          <CardTitle>User roles</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex h-full flex-col">
        <div className="h-[18rem] sm:h-[20rem] md:h-[22rem] lg:h-[24rem] flex w-full items-center justify-center">
          <ChartContainer
            className="h-full w-full"
            config={{
              student: { color: ROLE_COLORS.student },
              teacher: { color: ROLE_COLORS.teacher },
              admin: { color: ROLE_COLORS.admin },
              unknown: { color: ROLE_COLORS.unknown },
            }}
          >
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 16, right: 16, left: 16, bottom: 32 }}>
                  <Pie
                    data={roleChartData}
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
                    {roleChartData.map((entry) => (
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

export default UserRolesPieChart;
