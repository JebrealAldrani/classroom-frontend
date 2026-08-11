import { useShow } from "@refinedev/core";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import type { User } from "@/types";

const UsersShow = () => {
  const { query } = useShow<User>({ resource: "users" });
  const { data, isLoading, isError } = query;
  const user = data?.data;

  const formatDate = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "Unknown";

  if (isLoading || isError || !user) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="users" title="User details" />
        <p className="state-message">
          {isLoading
            ? "Loading user..."
            : isError
              ? "Failed to load user"
              : "User not found"}
        </p>
      </ShowView>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="users" title="User details" />

      <Card className="details-card">
        {/* <div className="details-header">
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>

          <div>
            <Badge className="capitalize">{user.role}</Badge>
            <Badge variant={user.emailVerified ? "default" : "secondary"}>
              {user.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div> */}

        <div className="details-grid">
          <div className="instructor">
            <p>Profile</p>
            <div>
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p>{user.name}</p>
                <p>{user.department ?? "No department assigned"}</p>
              </div>
            </div>
          </div>

          <div className="department">
            <p>Account info</p>
            <div>
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
              {/* <p>{user.emailVerified ? "Verified" : "Unverified"}</p> */}
            </div>
          </div>
        </div>

        <Separator />

        <div className="subject">
          <p>Details</p>
          <div>
            <span>Created</span>
            <p>{formatDate(user.createdAt)}</p>
            <p className="text-sm text-muted-foreground">
              Updated: {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>
      </Card>
    </ShowView>
  );
};

export default UsersShow;
