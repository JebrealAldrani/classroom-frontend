import { useEffect } from "react";
import { useShow, useBack, HttpError, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { subjectSchema } from "@/lib/schema.ts";
import { EditView } from "@/components/refine-ui/views/edit-view.tsx";
import { EditViewHeader } from "@/components/refine-ui/views/edit-view.tsx";
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
import type { Department, Subject } from "@/types";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

const SubjectsEdit = () => {
  const back = useBack();
  const { query: showQuery } = useShow<Subject>({ resource: "subjects" });
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: {
      pageSize: 1000,
    },
  });
  const subject = showQuery.data?.data;

  const departments = departmentsQuery?.data?.data ?? [];
  const departmentsLoading = departmentsQuery?.isLoading;

  const form = useForm<Subject, HttpError, z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
    setError,
  } = form;

  useEffect(() => {
    if (subject && (!subject.department_id || departments.length > 0)) {
      reset({
        name: subject.name,
        code: subject.code,
        departmentId: subject.department_id ?? subject.department?.id,
        description: subject.description,
      });
    }
  }, [subject, departments, reset]);

  const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
    if (subject && values.code !== subject.code) {
      setError("code", {
        type: "validate",
        message: "Subject code cannot be changed.",
      });
      return;
    }

    await onFinish(values);
  };

  return (
    <EditView>
      <EditViewHeader resource="subjects" title="Edit Subject" />
      <div className="intro-row">
        <p>Update subject details and department mapping.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>
      <Separator />
      <Card className="class-form-card">
        <CardHeader>
          <CardTitle>Edit subject</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
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
                      <Input
                        placeholder="BIO101"
                        {...field}
                        readOnly
                        tabIndex={-1}
                        aria-readonly="true"
                        aria-disabled="true"
                        className="cursor-not-allowed bg-muted text-muted-foreground opacity-70 pointer-events-none"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Subject code cannot be changed after creation.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="departmentId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>
                        Department <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(departmentId) => {
                          const department = departments.find(
                            (item) => item.id.toString() === departmentId,
                          );
                          field.onChange(department?.id ?? "");
                        }}
                        value={
                          field.value?.toString() ??
                          subject?.department_id?.toString() ??
                          ""
                        }
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
                  );
                }}
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
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </EditView>
  );
};

export default SubjectsEdit;
