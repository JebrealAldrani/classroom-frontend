import { useList } from "@refinedev/core";

import { Class, Department, Subject, User, UserRole } from "@/types";

import SubjectsBarChart from "@/components/charts/SubjectsBarChart";
import CapacitySnapshot from "@/components/cards/CapacitySnapshot";
import UserRolesPieChart from "@/components/charts/UserRolesPieChart";
import ClassStatusPieChart from "@/components/charts/ClassStatusPieChart";
import StatisticsCard from "@/components/cards/StatisticsCard";

const Dashboard = () => {
  const { query: usersQuery } = useList<User>({
    resource: "users",
    pagination: { pageSize: 100000, mode: "server" },
  });

  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100000, mode: "server" },
  });

  const { query: classesQuery } = useList<Class>({
    resource: "classes",
    pagination: { pageSize: 100000, mode: "server" },
  });

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 100000, mode: "server" },
  });

  const users = usersQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];
  const departmentsCount =
    departmentsQuery.data?.pagination?.total ??
    departmentsQuery.data?.data?.length ??
    0;
  const subjectsCount =
    subjectsQuery.data?.pagination?.total ??
    subjectsQuery.data?.data?.length ??
    0;

  const classStatusCounts = classes.reduce<Record<string, number>>(
    (acc, item) => {
      const key = item.status ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const totalSeats = classes.reduce(
    (sum, item) => sum + (item.capacity ?? 0),
    0,
  );
  const averageCapacity = classes.length
    ? Math.round(totalSeats / classes.length)
    : 0;
  const activeClassesCount = classStatusCounts.active ?? 0;
  const totalUsers = usersQuery.data?.pagination?.total ?? users.length;
  const totalClasses = classesQuery.data?.pagination?.total ?? classes.length;

  const loading =
    usersQuery.isLoading ||
    departmentsQuery.isLoading ||
    classesQuery.isLoading ||
    subjectsQuery.isLoading;

  const STATISTICS_CARDS = [
    {
      title: "Total users",
      count: totalUsers,
      badge: "Students, teachers, admins",
    },
    {
      title: "Active classes",
      count: activeClassesCount,
      badge: "Currently active",
    },
    {
      title: "Total subjects",
      count: subjectsCount,
      badge: "Subjects taught",
    },
    {
      title: "Departments",
      count: departmentsCount,
      badge: "Academic departments",
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor classroom resources, users, and class performance at a glance.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STATISTICS_CARDS.map((card) => (
          <StatisticsCard
            label={card.title}
            count={card.count}
            badgeText={card.badge}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <UserRolesPieChart users={users} loading={loading} />

          <ClassStatusPieChart
            classStatusCounts={classStatusCounts}
            loading={loading}
          />
        </div>

        <div className="grid gap-4 lg:col-span-8 grid-cols-1 lg:grid-cols-2">
          <SubjectsBarChart classes={classes} loading={loading} />

          <CapacitySnapshot
            loading={loading}
            totalSeats={totalSeats}
            averageCapacity={averageCapacity}
            activeClassesCount={activeClassesCount}
            totalClasses={totalClasses}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
