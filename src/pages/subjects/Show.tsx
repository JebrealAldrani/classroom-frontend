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
  BookOpen,
  Building2,
  GraduationCap,
  Calendar,
  Copy,
  Check,
  FileText,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import type { Subject } from "@/types";

const SubjectShow = () => {
  const { query } = useShow<Subject>({ resource: "subjects" });
  const { data, isLoading, isError, refetch } = query;
  const subject = data?.data;
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
    toast.success(`Course code "${code}" copied to clipboard`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="subjects" title="Subject Details" />

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

  // Error State
  if (isError || !subject) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="subjects" title="Subject Details" />

        <Card className="details-card border-destructive/20 bg-destructive/5 text-center py-12 px-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="size-14 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="size-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isError ? "Failed to Load Subject" : "Subject Not Found"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The requested subject syllabus could not be retrieved or does not exist.
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

  const { id, name, code, description, department, department_id, createdAt } = subject;
  const targetDepartmentId = department?.id || department_id;

  return (
    <div className="class-view class-show">
      <ShowViewHeader resource="subjects" title="Subject Details" />

      {/* Virtual Identity Hero Banner */}
      <div className="banner">
        <div className="w-full min-h-[170px] sm:min-h-[210px] md:min-h-[240px] rounded-xl relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 border border-indigo-800/30 text-white p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-lg">
          {/* Ambient Lighting */}
          <div className="absolute -top-16 -left-16 size-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 size-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          {/* Watermark Emblem */}
          <div className="absolute right-4 bottom-2 sm:right-8 sm:bottom-4 opacity-10 pointer-events-none flex items-center justify-center">
            <BookOpen className="size-36 sm:size-48 md:size-56 stroke-[1]" />
          </div>

          {/* Top Meta Bar */}
          <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
                <Sparkles className="size-3 text-indigo-300" />
                Academic Curriculum
              </span>
              <span className="hidden sm:inline-flex text-xs text-indigo-200/70 font-mono">
                Catalog #{id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-white/15 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-mono text-xs">
                CODE: {code}
              </Badge>
              <Badge className="bg-indigo-500 text-white border-none font-semibold text-xs shadow-sm">
                ACCREDITED
              </Badge>
            </div>
          </div>

          {/* Center Identity Seal & Title */}
          <div className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="size-14 sm:size-16 md:size-18 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex flex-col items-center justify-center text-white">
                <BookOpen className="size-7 sm:size-8 text-indigo-300 mb-0.5" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-200 uppercase">
                  {code.slice(0, 4)}
                </span>
              </div>

              <div className="space-y-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight break-words">
                  {name}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100/80 line-clamp-2 max-w-xl">
                  {department?.name ? `Department of ${department.name}` : "General Curriculum Subject"}
                </p>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end text-right text-xs text-white/70">
              <span className="font-semibold text-white">Course Syllabus</span>
              <span>Classroom Instruction Track</span>
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
            <p>{description || "Official course curriculum specification."}</p>
          </div>
          <div>
            <Badge variant="outline" className="font-mono text-xs">
              Code: {code}
            </Badge>
            <Badge variant="secondary">
              {department?.name ?? "General Studies"}
            </Badge>
            <Badge data-status="active">ACTIVE CURRICULUM</Badge>
          </div>
        </div>

        {/* Structured Information Grid */}
        <div className="details-grid">
          {/* Department Affiliation */}
          <div className="instructor">
            <p>Affiliated Department</p>
            <div>
              <div className="size-13 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-2 ring-indigo-500/20 shrink-0">
                <Building2 className="size-6" />
              </div>
              <div className="space-y-1">
                {targetDepartmentId ? (
                  <Link
                    to={`/departments/show/${targetDepartmentId}`}
                    className="group inline-flex items-center gap-1.5 font-bold text-base text-primary hover:underline"
                  >
                    <span>{department?.name ?? `Department #${targetDepartmentId}`}</span>
                    <ExternalLink className="size-3.5 opacity-70 group-hover:opacity-100" />
                  </Link>
                ) : (
                  <p className="font-bold text-base text-primary">
                    {department?.name ?? "No Department Assigned"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground font-mono">
                  {department?.code ? `Dept Code: ${department.code}` : "Academic Division"}
                </p>
              </div>
            </div>
          </div>

          {/* Course Identifiers */}
          <div className="department">
            <p>Course Identifiers</p>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold text-lg text-primary">{code}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopyCode(code)}
                  title="Copy Course Code"
                >
                  {copiedCode ? (
                    <Check className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
              <p>Standard Academic Credit &bull; Catalog Entry #{id}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Course Syllabus & Description */}
        <div className="subject">
          <p>Course Syllabus & Description</p>
          <div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 sm:p-5 text-sm leading-relaxed text-foreground/90">
              <div className="flex items-start gap-3">
                <FileText className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Curriculum Overview</p>
                  <p className="text-muted-foreground">
                    {description ||
                      "This subject covers foundational and advanced principles within its domain. Designed to build practical competencies and theoretical understanding through structured class lectures and assignments."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Class Enrollment & Offerings Hub */}
        <div className="join">
          <h2>Classroom Sections & Enrollment</h2>
          <ol>
            <li>Find active classroom sections currently instructing this subject.</li>
            <li>Review teacher assignments, lecture schedules, and open seat spots.</li>
            <li>Request a class invitation code or join an open section.</li>
          </ol>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <GraduationCap className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Explore Classes</h3>
                  <p className="text-xs text-muted-foreground">Active classroom sections</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link to="/classes">Browse Classes for this Subject</Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <PlusCircle className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Offer New Class</h3>
                  <p className="text-xs text-muted-foreground">Create a class section</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link to="/classes/create">Open New Class Section</Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Audit Information */}
        <div className="details-grid">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Curriculum Registration
            </span>
            <div className="flex items-center gap-2 text-sm text-foreground/80 mt-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Created: {formatDate(createdAt)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Affiliation Node
            </span>
            <div className="flex items-center gap-2 text-sm text-foreground/80 mt-1">
              <Building2 className="size-4 text-muted-foreground" />
              <span>
                {department?.name ? `${department.name} (${department.code})` : "General Studies"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => navigate("/classes")}
          >
            <GraduationCap className="size-4.5" />
            Browse Active Classes for this Subject
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SubjectShow;
