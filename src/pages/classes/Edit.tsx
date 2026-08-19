import { useEffect } from "react";
import { useBack, useShow, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { classSchema } from "@/lib/schema.ts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Loader2 } from "lucide-react";
import { Class, Subject, User } from "@/types";
import * as z from "zod";

const ClassesEdit = () => {
  const back = useBack();
  const { query: showQuery } = useShow<Class>({ resource: "classes" });
  const classrooms = showQuery.data?.data;

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 50,
    },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: {
      pageSize: 50,
    },
  });

  const subjects = subjectsQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema) as any,
    refineCoreProps: {
      resource: "classes",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  useEffect(() => {
    if (classrooms) {
      reset({
        name: classrooms.name,
        description: classrooms.description ?? "",
        subjectId: Number(classrooms.subjectId),
        teacherId: classrooms.teacherId,
        capacity: classrooms.capacity,
        status: classrooms.status as z.infer<typeof classSchema>["status"],
        bannerUrl: classrooms.bannerUrl ?? "",
        bannerCldPubId: classrooms.bannerCldPubId ?? "",
        inviteCode: classrooms.inviteCode ?? "",
        schedules: classrooms.schedules ?? [],
      });
    }
  }, [classrooms, reset]);

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    await onFinish(values);
  };

  return (
    <EditView>
      <EditViewHeader resource="classes" title="Edit Class" />
      <div className="intro-row">
        <p>Update class details, schedule, and assignment.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>
      <Separator />
      <div className="my-4 flex items-center">
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Edit class</CardTitle>
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
                      <FormLabel>Class Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Intro to Biology" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="Class description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem
                                  key={subject.id}
                                  value={subject.id.toString()}
                                >
                                  {subject.name} ({subject.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a teacher" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="30"
                            value={field.value?.toString() ?? ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="bannerCldPubId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Public ID</FormLabel>
                      <FormControl>
                        <Input placeholder="cloudinary-public-id" {...field} />
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
      </div>
    </EditView>
  );
};

export default ClassesEdit;
