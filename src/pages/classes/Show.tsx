import { useState } from "react";
import { useShow, useBack } from "@refinedev/core";
import { Link, useNavigate } from "react-router";
import { ClassDetails, Schedule } from "@/types";
import { ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary.ts";
import { toast } from "sonner";
import {
  GraduationCap,
  Building2,
  BookOpen,
  User as UserIcon,
  Mail,
  Calendar,
  Clock,
  Users,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  KeyRound,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

const ClassShow = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });
  const { data, isLoading, isError, refetch } = query;
  const classDetails = data?.data;
  const back = useBack();
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success(`Course code "${code}" copied to clipboard`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInvite = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedInvite(true);
    toast.success(`Invite code "${code}" copied to clipboard`);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />

        <div className="banner">
          <Skeleton className="w-full min-h-[160px] sm:min-h-[200px] md:min-h-[240px] rounded-xl" />
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
          <Skeleton className="h-28 w-full rounded-lg" />
        </Card>
      </div>
    );
  }

  // Error State
  if (isError || !classDetails) {
    return (
      <div className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />

        <Card className="details-card border-destructive/20 bg-destructive/5 text-center py-12 px-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="size-14 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="size-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isError ? "Failed to Load Class Details" : "Class Details Not Found"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The requested classroom record could not be retrieved or does not exist.
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

  const {
    id,
    bannerUrl,
    name,
    description,
    capacity,
    status,
    teacher,
    subject,
    department,
    bannerCldPubId,
    schedules,
    inviteCode,
    courseCode,
  } = classDetails;

  const teacherName = teacher?.name ?? "Assigned Instructor";
  const teacherInitials =
    teacherName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "TR";

  const effectiveCourseCode = subject?.code || courseCode || "CLASS";

  return (
    <div className="class-view class-show">
      <ShowViewHeader resource="classes" title="Class Details" />

      {/* Hero Banner Section */}
      <div className="banner">
        {bannerUrl && bannerCldPubId ? (
          <div className="relative w-full overflow-hidden rounded-xl shadow-md min-h-[160px] sm:min-h-[200px] md:min-h-[240px]">
            <AdvancedImage
              alt={name}
              cldImg={bannerPhoto(bannerCldPubId, name)}
              className="w-full h-full object-cover min-h-[160px] sm:min-h-[200px] md:min-h-[240px]"
            />
            {/* Ambient overlay for high-contrast badge readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <Badge className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border-white/20 text-xs">
                {capacity} SPOTS
              </Badge>
              <Badge
                className={
                  status === "active"
                    ? "bg-green-600 text-white border-transparent"
                    : "bg-gray-600 text-white border-transparent"
                }
              >
                {status.toUpperCase()}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-[170px] sm:min-h-[210px] md:min-h-[240px] rounded-xl relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border border-emerald-800/30 text-white p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-lg">
            {/* Ambient lighting */}
            <div className="absolute -top-16 -left-16 size-60 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 size-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

            {/* Watermark Emblem */}
            <div className="absolute right-4 bottom-2 sm:right-8 sm:bottom-4 opacity-10 pointer-events-none flex items-center justify-center">
              <GraduationCap className="size-36 sm:size-48 md:size-56 stroke-[1]" />
            </div>

            {/* Top Meta Bar */}
            <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
                  <Sparkles className="size-3 text-emerald-300" />
                  Active Classroom Section
                </span>
                {id && (
                  <span className="hidden sm:inline-flex text-xs text-emerald-200/70 font-mono">
                    Class #{id}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-white/15 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-mono text-xs">
                  {capacity} SPOTS
                </Badge>
                <Badge
                  className={
                    status === "active"
                      ? "bg-green-600 text-white border-none font-semibold text-xs shadow-sm"
                      : "bg-gray-600 text-white border-none font-semibold text-xs shadow-sm"
                  }
                >
                  {status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Center Identity Seal & Title */}
            <div className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                <div className="size-14 sm:size-16 md:size-18 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex flex-col items-center justify-center text-white">
                  <GraduationCap className="size-7 sm:size-8 text-emerald-300 mb-0.5" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-200 uppercase">
                    {effectiveCourseCode.slice(0, 4)}
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight break-words">
                    {name}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100/80 line-clamp-2 max-w-xl">
                    {description || "Classroom instruction section and academic syllabus."}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end text-right text-xs text-white/70 shrink-0">
                <span className="font-semibold text-white">Course Code: {effectiveCourseCode}</span>
                <span>Classroom Academic Roster</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Details Card */}
      <Card className="details-card">
        {/* Header Details */}
        <div className="details-header">
          <div>
            <h1>{name}</h1>
            <p>{description || "Classroom instruction section and academic syllabus."}</p>
          </div>
          <div>
            <Badge variant="outline" className="font-mono text-xs">
              {capacity} spots
            </Badge>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              data-status={status}
            >
              {status.toUpperCase()}
            </Badge>
            {effectiveCourseCode && (
              <Badge variant="outline" className="font-mono text-xs">
                Code: {effectiveCourseCode}
              </Badge>
            )}
          </div>
        </div>

        {/* Structured Information Grid */}
        <div className="details-grid">
          {/* Instructor Block */}
          <div className="instructor">
            <p>Faculty Instructor</p>
            <div>
              <Avatar className="size-13 rounded-full ring-2 ring-primary/20 shrink-0">
                <AvatarImage src={teacher?.image ?? ""} alt={teacherName} />
                <AvatarFallback className="font-mono font-bold bg-primary/10 text-primary">
                  {teacherInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                {teacher?.id ? (
                  <Link
                    to={`/users/show/${teacher.id}`}
                    className="group inline-flex items-center gap-1.5 font-bold text-base text-primary hover:underline"
                  >
                    <span>{teacherName}</span>
                    <ExternalLink className="size-3.5 opacity-70 group-hover:opacity-100" />
                  </Link>
                ) : (
                  <p className="font-bold text-base text-primary">{teacherName}</p>
                )}
                {teacher?.email ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="size-3" />
                    <a
                      href={`mailto:${teacher.email}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {teacher.email}
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Assigned Faculty Member</p>
                )}
              </div>
            </div>
          </div>

          {/* Subject Affiliation */}
          <div className="department">
            <p>Subject & Curriculum</p>
            <div>
              {subject?.id ? (
                <div className="space-y-1">
                  <Link
                    to={`/subjects/show/${subject.id}`}
                    className="group inline-flex items-center gap-1.5 text-lg font-bold text-primary hover:underline"
                  >
                    <span>{subject.name}</span>
                    <ExternalLink className="size-3.5 opacity-70 group-hover:opacity-100" />
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Code: <span className="font-mono font-semibold">{subject.code}</span>
                    {subject.department?.name && ` • Dept: ${subject.department.name}`}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-lg font-bold text-primary">
                    {subject?.name ?? "General Academic Subject"}
                  </p>
                  <p className="text-xs text-muted-foreground">Standard Curriculum</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Overview Details */}
        <div className="subject">
          <p>Curriculum Details</p>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                Code: {effectiveCourseCode}
              </Badge>
              {department?.name && (
                <Badge variant="secondary" className="text-xs">
                  {department.name}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-muted-foreground hover:text-foreground"
                onClick={() => handleCopyCode(effectiveCourseCode)}
                title="Copy Course Code"
              >
                {copiedCode ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
            <p className="font-bold text-lg text-primary">
              {subject?.name || name}
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {subject?.description || description || "Standard accredited class curriculum and learning objectives."}
            </p>
          </div>
        </div>

        {/* Class Schedules Section (If available) */}
        {schedules && schedules.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Class Meeting Schedules
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {schedules.map((schedule: Schedule, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground">
                        {schedule.day}
                      </span>
                      <Badge variant="outline" className="text-[11px] font-mono">
                        Slot #{index + 1}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5 text-primary" />
                      <span>
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Invite Code & Enrollment Section */}
        {inviteCode && (
          <>
            <Separator />
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Class Invite Code</h4>
                  <p className="text-xs text-muted-foreground">
                    Students can enter this access code to enroll into this class section.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <code className="px-3.5 py-1.5 rounded-lg bg-background border border-border font-mono font-bold text-base text-primary tracking-wider shadow-sm">
                  {inviteCode}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyInvite(inviteCode)}
                  className="gap-1.5 text-xs"
                >
                  {copiedInvite ? (
                    <>
                      <Check className="size-3.5 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Join Instructions */}
        <div className="join">
          <h2>Enrollment & Participation</h2>
          <ol>
            <li>Obtain the class invitation code from your instructor or course syllabus.</li>
            <li>Click the "Join Class" button below or navigate to your student dashboard.</li>
            <li>Paste your verification code to confirm class enrollment and access materials.</li>
          </ol>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={() => {
              if (inviteCode) {
                handleCopyInvite(inviteCode);
              }
              toast.success("Ready to join class. Follow the enrollment prompts.");
            }}
          >
            <CheckCircle2 className="size-4.5" />
            Join Class
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/classes")}
          >
            Browse All Classes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ClassShow;
