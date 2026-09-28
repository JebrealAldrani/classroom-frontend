import { useState } from "react";
import { useShow, useBack } from "@refinedev/core";
import { Link } from "react-router";
import { ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Building2,
  GraduationCap,
  School,
  ShieldCheck,
  Calendar,
  Clock,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  BookOpen,
  Send,
} from "lucide-react";
import { User, UserRole } from "@/types";

const UsersShow = () => {
  const { query } = useShow<User>({ resource: "users" });
  const { data, isLoading, isError, refetch } = query;
  const user = data?.data;
  const back = useBack();

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const formatDate = (value?: string) => {
    if (!value) return "Not recorded";
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return value;
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success(`Email "${email}" copied to clipboard`);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="users" title="User Profile" />

        <div className="banner">
          <Skeleton className="w-full min-h-[140px] sm:min-h-[180px] md:min-h-[200px] rounded-xl" />
        </div>

        <Card className="details-card">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Skeleton className="size-24 sm:size-28 rounded-full shrink-0" />
            <div className="space-y-2.5 flex-1 text-center sm:text-left w-full">
              <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
              <div className="flex gap-2 justify-center sm:justify-start pt-1">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          <Separator className="my-2" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </Card>
      </div>
    );
  }

  // Error State
  if (isError || !user) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="users" title="User Profile" />

        <Card className="details-card border-destructive/20 bg-destructive/5 text-center py-12 px-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="size-14 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="size-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isError ? "Failed to Load User Profile" : "User Not Found"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The requested user account could not be retrieved or does not exist.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => back()}>
                Go Back
              </Button>
              <Button onClick={() => refetch()} className="gap-2">
                <RefreshCw className="size-4" /> Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const { id, name, email, role, image, department, departmentId, createdAt, updatedAt } = user;

  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const getRoleConfig = (userRole: UserRole | string) => {
    switch (userRole) {
      case UserRole.TEACHER:
      case "teacher":
        return {
          label: "Faculty Teacher",
          badgeClass: "bg-emerald-600 text-white border-transparent hover:bg-emerald-700",
          icon: School,
          description:
            "Authorized to create and instruct classroom sections, manage students, publish schedules, and evaluate performance.",
          scopeTitle: "Academic Instructor Track",
        };
      case UserRole.ADMIN:
      case "admin":
        return {
          label: "System Administrator",
          badgeClass: "bg-purple-600 text-white border-transparent hover:bg-purple-700",
          icon: ShieldCheck,
          description:
            "Full administrator privileges across system departments, subjects, classrooms, user directories, and academic settings.",
          scopeTitle: "Campus Administration & Control",
        };
      case UserRole.STUDENT:
      case "student":
      default:
        return {
          label: "Enrolled Student",
          badgeClass: "bg-blue-600 text-white border-transparent hover:bg-blue-700",
          icon: GraduationCap,
          description:
            "Authorized to participate in registered classroom courses, access lecture materials, and interact with academic instructors.",
          scopeTitle: "Student Learning & Curriculum Track",
        };
    }
  };

  const roleConfig = getRoleConfig(role);
  const RoleIcon = roleConfig.icon;
  const targetDepartmentId = department?.id || departmentId;

  return (
    <div className="class-view class-show">
      <ShowViewHeader resource="users" title="User Profile" />

      {/* Profile Cover Banner */}
      <div className="banner">
        <div className="w-full h-36 sm:h-44 md:h-52 rounded-xl relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/30 text-white p-4 sm:p-6 flex flex-col justify-between shadow-md">
          {/* Ambient Lighting */}
          <div className="absolute -top-12 -left-12 size-52 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 size-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Watermark Emblem */}
          <div className="absolute right-4 bottom-2 sm:right-6 sm:bottom-3 opacity-10 pointer-events-none flex items-center justify-center">
            <RoleIcon className="size-28 sm:size-36 md:size-44 stroke-[1]" />
          </div>

          {/* Top Meta Bar */}
          <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
              <Sparkles className="size-3 text-emerald-300" />
              Digital Campus ID
            </span>

            <div className="flex items-center gap-2">
              <Badge className={`${roleConfig.badgeClass} font-semibold text-xs shadow-sm flex items-center gap-1`}>
                <RoleIcon className="size-3" />
                {role?.toUpperCase()}
              </Badge>
              <Badge className="bg-white/15 hover:bg-white/20 text-white border-white/20 backdrop-blur-md text-xs">
                ACTIVE
              </Badge>
            </div>
          </div>

          {/* Clean bottom spacer - No text here to prevent any collision */}
          <div className="relative z-10 text-xs text-white/60 font-mono">
            User ID: {id.slice(0, 12)}...
          </div>
        </div>
      </div>

      {/* Main Details Card - Clean Vertical Profile Flow */}
      <Card className="details-card">
        {/* Profile Identity Bar - Naturally Positioned (Never Overlapping Content) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-2">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* Avatar Container */}
            <div className="relative shrink-0">
              <Avatar className="size-20 sm:size-24 md:size-28 rounded-full ring-4 ring-primary/20 bg-background shadow-md">
                <AvatarImage src={image ?? ""} alt={name} className="object-cover" />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 size-7 sm:size-8 rounded-full ${roleConfig.badgeClass} ring-2 ring-background flex items-center justify-center shadow`}
                title={roleConfig.label}
              >
                <RoleIcon className="size-3.5 sm:size-4 text-white" />
              </div>
            </div>

            {/* Profile Identity Text */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  {name}
                </h1>
                <Badge className={roleConfig.badgeClass}>
                  {roleConfig.label}
                </Badge>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Mail className="size-3.5 text-primary shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-primary transition-colors font-medium hover:underline break-all"
                >
                  {email}
                </a>
              </div>

              <p className="text-xs text-muted-foreground font-medium">
                {department?.name
                  ? `Department of ${department.name}`
                  : "General Campus Member (Unassigned Faculty)"}
              </p>
            </div>
          </div>

          {/* Quick Meta Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              ID: {id.slice(0, 8)}...
            </Badge>
            {department?.name && (
              <Badge variant="secondary" className="text-xs">
                {department.name}
              </Badge>
            )}
            <Badge data-status="active">ACTIVE</Badge>
          </div>
        </div>

        <Separator />

        {/* Structured Information Grid */}
        <div className="details-grid">
          {/* Profile & Contact Channel */}
          <div className="instructor">
            <p>Contact & Profile</p>
            <div>
              <div className="size-13 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-primary/20 shrink-0">
                <UserIcon className="size-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-base text-foreground truncate">{email}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => handleCopyEmail(email)}
                    title="Copy Email Address"
                  >
                    {copiedEmail ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <span>ID: {id.slice(0, 14)}...</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => handleCopyId(id)}
                    title="Copy Full ID"
                  >
                    {copiedId ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Department Affiliation */}
          <div className="department">
            <p>Department Assignment</p>
            <div>
              {targetDepartmentId ? (
                <div className="space-y-1">
                  <Link
                    to={`/departments/show/${targetDepartmentId}`}
                    className="group inline-flex items-center gap-1.5 text-lg font-bold text-primary hover:underline"
                  >
                    <span>{department?.name ?? `Department #${targetDepartmentId}`}</span>
                    <ExternalLink className="size-3.5 opacity-70 group-hover:opacity-100" />
                  </Link>
                  <p className="text-xs text-muted-foreground font-mono">
                    {department?.code ? `Code: ${department.code}` : "Academic Faculty"} &bull; Assigned Unit
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-lg font-bold text-muted-foreground">Unassigned Department</p>
                  <p className="text-xs text-muted-foreground">
                    This user is not currently attached to a designated academic department.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Role & Privileges Specification */}
        <div className="subject">
          <p>Campus Role & Permissions</p>
          <div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 sm:p-5 text-sm leading-relaxed text-foreground/90">
              <div className="flex items-start gap-3">
                <RoleIcon className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{roleConfig.scopeTitle}</p>
                  <p className="text-muted-foreground">{roleConfig.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Directory Navigation & Connected Hub */}
        <div className="join">
          <h2>Directory Actions & Operations</h2>
          <ol>
            <li>Communicate directly with this campus member via verified email.</li>
            <li>Explore registered classes and academic courses associated with this member.</li>
            <li>Review department curriculum and faculty rosters.</li>
          </ol>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3">
            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <GraduationCap className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Classes</h3>
                  <p className="text-xs text-muted-foreground">
                    {role === "teacher" ? "Teaching classes" : "Enrolled classes"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link to="/classes">Browse Classes</Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <BookOpen className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Subjects</h3>
                  <p className="text-xs text-muted-foreground">Course curriculum</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link to="/subjects">Explore Subjects</Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Building2 className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Department</h3>
                  <p className="text-xs text-muted-foreground">Faculty division</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link to={targetDepartmentId ? `/departments/show/${targetDepartmentId}` : "/departments"}>
                  {targetDepartmentId ? "View Department" : "All Departments"}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Audit Timeline */}
        <div className="details-grid">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Account Registration
            </span>
            <div className="flex items-center gap-2 text-sm text-foreground/80 mt-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Member Since: {formatDate(createdAt)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Profile Last Modified
            </span>
            <div className="flex items-center gap-2 text-sm text-foreground/80 mt-1">
              <Clock className="size-4 text-muted-foreground" />
              <span>Updated: {formatDate(updatedAt || createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            size="lg"
            className="w-full gap-2"
            asChild
          >
            <a href={`mailto:${email}`}>
              <Send className="size-4.5" />
              Send Direct Email to {name}
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UsersShow;
