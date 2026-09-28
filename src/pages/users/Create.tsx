import { HttpError, useBack } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { schema } from "@/lib/schema.ts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Loader2 } from "lucide-react";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import UploadWidget from "@/components/UploadWidget";
import { useList } from "@refinedev/core";
import type { Department } from "@/types";
import * as z from "zod";
import { User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const CreateUser = () => {
  const back = useBack();
  const form = useForm<User, HttpError, z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    refineCoreProps: {
      resource: "users",
      action: "create",
      errorNotification: (error) => ({
        type: "error",
        message: error?.message ?? "Unable to create user",
      }),
    },
  });
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 1000 },
  });
  const departments = departmentsQuery.data?.data ?? [];
  const departmentsLoading = departmentsQuery.isLoading;

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
    setValue,
  } = form;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await onFinish(values);
  };

  if (departmentsLoading) {
    return (
      <CreateView className="class-view">
        <Breadcrumb />
        <h1 className="page-title">Create User</h1>
        <div className="intro-row">
          <p>Add a new classroom user to the system.</p>
          <Button onClick={() => back()}>Go Back</Button>
        </div>
        <Separator />
        <div className="my-4 flex items-center">
          <Card className="class-form-card">
            <CardHeader>
              <Skeleton className="h-7 w-32 rounded-md" />
            </CardHeader>
            <Separator />
            <CardContent className="mt-7 space-y-5">
              {/* Avatar Skeleton */}
              <div className="flex justify-center pb-2">
                <Skeleton className="size-28 rounded-full" />
              </div>

              {/* Name Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Email Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Role Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Department Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Password Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Confirm Password Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
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
      <h1 className="page-title">Create User</h1>
      <div className="intro-row">
        <p>Add a new classroom user to the system.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>
      <Separator />
      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader>
            <CardTitle>User profile</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-7">
            <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Profile image</FormLabel>
                    <FormControl>
                      <UploadWidget
                        avatar
                        value={
                          field.value
                            ? { url: field.value, publicId: "" }
                            : null
                        }
                        onChange={(value) => {
                          field.onChange(value?.url ?? "");
                          setValue("imageCldPubId", value?.publicId ?? "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jane@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value ?? "")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={String(department.id)}
                            >
                              {department.name}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder="At least 8 characters"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder="Repeat the password"
                        {...field}
                      />
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
                  "Create User"
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

export default CreateUser;
