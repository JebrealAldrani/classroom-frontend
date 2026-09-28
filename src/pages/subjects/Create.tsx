import { useBack, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { subjectSchema } from "@/lib/schema.ts";
import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { HttpError } from "@refinedev/core";
import type { Department } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const SubjectsCreate = () => {
  const back = useBack();
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 1000 },
  });

  const departments = departmentsQuery.data?.data ?? [];
  const departmentsLoading = departmentsQuery.isLoading;

  const form = useForm<
    z.infer<typeof subjectSchema>,
    HttpError,
    z.infer<typeof subjectSchema>
  >({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "create",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
    await onFinish(values);
  };

  if (departmentsLoading) {
    return (
      <CreateView className="class-view">
        <Breadcrumb />
        <h1 className="page-title">Create Subject</h1>
        <div className="intro-row">
          <p>Define a new curriculum subject for the classroom.</p>
          <Button onClick={() => back()}>Go Back</Button>
        </div>
        <Separator />
        <div className="my-4 flex items-center">
          <Card className="class-form-card">
            <CardHeader>
              <Skeleton className="h-7 w-36 rounded-md" />
            </CardHeader>
            <Separator />
            <CardContent className="mt-7 space-y-5">
              {/* Name Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Code Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Department Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Button Skeleton */}
              <Skeleton className="h-11 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </CreateView>
    );
  }

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Create Subject</h1>
      <div className="intro-row">
        <p>Define a new curriculum subject for the classroom.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>
      <Separator />
      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader>
            <CardTitle>Subject details</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Biology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="BIO101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={departmentsLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full">
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Subject"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  </CreateView>
  );
};

export default SubjectsCreate;
