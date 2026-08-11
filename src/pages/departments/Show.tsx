import { useShow } from "@refinedev/core";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { Department } from "@/types";

const DepartmentsShow = () => {
  const { query } = useShow<Department>({ resource: "departments" });
  const { data, isLoading, isError } = query;
  const department = data?.data;

  if (isLoading || isError || !department) {
    return (
      <ShowView>
        <ShowViewHeader resource="departments" title="Department details" />
        <p className="state-message">
          {isLoading
            ? "Loading department..."
            : isError
              ? "Failed to load department"
              : "Department not found"}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader resource="departments" title="Department details" />
      <Card className="class-view class-show">
        <div className="grid gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{department.name}</h1>
            <p className="text-sm text-muted-foreground">{department.code}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{department.code}</Badge>
            <Badge variant="secondary">
              {department.description ?? "No description"}
            </Badge>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-2 text-foreground">{department.description}</p>
          </div>
        </div>
      </Card>
    </ShowView>
  );
};

export default DepartmentsShow;
