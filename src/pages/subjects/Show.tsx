import { useShow } from "@refinedev/core";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { Subject } from "@/types";

const SubjectShow = () => {
  const { query } = useShow<Subject>({ resource: "subjects" });
  const { data, isLoading, isError } = query;
  const subject = data?.data;

  if (isLoading || isError || !subject) {
    return (
      <ShowView>
        <ShowViewHeader resource="subjects" title="Subject details" />
        <p className="state-message">
          {isLoading
            ? "Loading subject..."
            : isError
              ? "Failed to load subject"
              : "Subject not found"}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader resource="subjects" title="Subject details" />
      <Card className="class-view class-show">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{subject.name}</h1>
              <p className="text-muted-foreground">{subject.code}</p>
            </div>
            <Badge variant="secondary">
              {subject.department?.name ?? "Unassigned"}
            </Badge>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-2 text-foreground">{subject.description}</p>
          </div>
        </div>
      </Card>
    </ShowView>
  );
};

export default SubjectShow;
