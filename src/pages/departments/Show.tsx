import { useState } from "react";
import { useShow, useBack } from "@refinedev/core";
import { Link, useNavigate } from "react-router";
import { ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { toast } from "sonner";
import {
  Building2,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Copy,
  Check,
  FileText,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { Department } from "@/types";

const DepartmentsShow = () => {
  const { query } = useShow<Department>({ resource: "departments" });
  const { data, isLoading, isError, refetch } = query;
  const department = data?.data;
  const back = useBack();
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success(`Department code "${code}" copied to clipboard`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="departments" title="Department Details" />

        <div className="banner">
          <Skeleton className="w-full min-h-[160px] sm:min-h-[200px] md:min-h-[230px] rounded-xl" />
        </div>

        <Card className="details-card">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-13 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          <Separator className="my-4" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </Card>
      </div>
    );
  }

  // Error / Not Found State
  if (isError || !department) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="departments" title="Department Details" />

        <Card className="details-card border-destructive/20 bg-destructive/5 text-center py-12 px-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="size-14 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="size-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isError ? "Failed to Load Department" : "Department Not Found"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The requested department record could not be retrieved or does not exist.
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

  const { id, code, name, description, createdAt, updatedAt } = department;

  return (
    <div className="class-view class-show">
      <ShowViewHeader resource="departments" title="Department Details" />

      {/* Virtual Identity Hero Banner */}
      <div className="banner">
        <div className="w-full min-h-[170px] sm:min-h-[210px] md:min-h-[240px] rounded-xl relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border border-emerald-800/30 text-white p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-lg">
          {/* Ambient decorative lighting */}
          <div className="absolute -top-16 -left-16 size-60 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 size-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

          {/* Background Blueprint / Watermark seal */}
          <div className="absolute right-4 bottom-2 sm:right-8 sm:bottom-4 opacity-10 pointer-events-none flex items-center justify-center">
            <Building2 className="size-36 sm:size-48 md:size-56 stroke-[1]" />
          </div>

          {/* Top Meta Bar */}
          <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
                <Sparkles className="size-3 text-emerald-300" />
                Academic Department
              </span>
              <span className="hidden sm:inline-flex text-xs text-emerald-200/70 font-mono">
                ID #{id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-white/15 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-mono text-xs">
                CODE: {code}
              </Badge>
              <Badge className="bg-emerald-500 text-white border-none font-semibold text-xs shadow-sm">
                ACTIVE
              </Badge>
            </div>
          </div>

          {/* Center / Bottom Identity Emblem & Title */}
          <div className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="size-14 sm:size-16 md:size-18 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex flex-col items-center justify-center text-white">
                <Building2 className="size-7 sm:size-8 text-emerald-300 mb-0.5" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-200 uppercase">
                  {code.slice(0, 4)}
                </span>
              </div>

              <div className="space-y-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight break-words">
                  {name}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/80 line-clamp-2 max-w-xl">
                  {description || "Official academic department and faculty curriculum host."}
                </p>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end text-right text-xs text-white/70">
              <span className="font-semibold text-white">Academic Faculty Unit</span>
              <span>Classroom Management Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Card */}
      <Card className="details-card">
        {/* Header Details */}
        <div className="details-header">
          <div>
            <h1>{name}</h1>
            <p>{description || "Official academic faculty and curriculum unit."}</p>
          </div>
          <div>
            <Badge variant="outline" className="font-mono text-xs">
              Code: {code}
            </Badge>
            <Badge data-status="active">ACTIVE DEPARTMENT</Badge>
            <Badge variant="secondary">Unit #{id}</Badge>
          </div>
        </div>

        {/* Structured Information Grid */}
        <div className="details-grid">
          {/* Academic Unit Identity */}
          <div className="instructor">
            <p>Academic Identity</p>
            <div>
              <div className="size-13 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-2 ring-emerald-500/20 shrink-0">
                <Building2 className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-base text-primary">{code}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-foreground"
                    onClick={() => handleCopyCode(code)}
                    title="Copy Department Code"
                  >
                    {copiedCode ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>
                <p>{name}</p>
              </div>
            </div>
          </div>

          {/* Department Classification */}
          <div className="department">
            <p>Organizational Status</p>
            <div>
              <p>Primary Academic Unit</p>
              <p>
                Oversees course curriculum, subjects, student enrollments, and teaching faculty.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Mission & Overview */}
        <div className="subject">
          <p>Department Overview & Mission</p>
          <div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 sm:p-5 text-sm leading-relaxed text-foreground/90">
              <div className="flex items-start gap-3">
                <FileText className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Mission Statement</p>
                  <p className="text-muted-foreground">
                    {description
                      ? description
                      : "This department fosters specialized academic education, coordinates structured curriculum tracks, and maintains accredited standards across all registered subjects and classroom sections."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Connected Campus Resources Hub */}
        <div className="join">
          <h2>Connected Campus Directory</h2>
          <ol>
            <li>Explore accredited subjects registered under this department.</li>
            <li>Connect with faculty teachers and students affiliated with this department.</li>
            <li>Browse classroom sessions and schedule offerings.</li>
          </ol>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3">
            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <BookOpen className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Subjects</h3>
                  <p className="text-xs text-muted-foreground">Curriculum courses</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between text-xs"
                asChild
              >
                <Link to="/subjects">
                  Browse Subjects
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Members</h3>
                  <p className="text-xs text-muted-foreground">Faculty & students</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between text-xs"
                asChild
              >
                <Link to="/users">
                  View Members
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <GraduationCap className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Classes</h3>
                  <p className="text-xs text-muted-foreground">Active classrooms</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between text-xs"
                asChild
              >
                <Link to="/classes">
                  Explore Classes
                  <ArrowRight className="size-3.5" />
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
              System Registration
            </span>
            <div className="flex items-center gap-2 text-sm text-foreground/80 mt-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Created: {formatDate(createdAt)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Last Record Update
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
            onClick={() => navigate("/subjects")}
          >
            <BookOpen className="size-4.5" />
            Explore Subjects in this Department
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DepartmentsShow;
