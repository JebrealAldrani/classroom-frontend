import { useEffect } from "react";
import { useShow, useBack, HttpError } from "@refinedev/core";
import { useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { departmentSchema } from "@/lib/schema.ts";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Department } from "@/types";
import * as z from "zod";
import { Skeleton } from "@/components/ui/skeleton";

const DepartmentsEdit = () => {
  const back = useBack();
  const { id } = useParams<{ id: string }>();
  const { query } = useShow<Department>({ resource: "departments", id });
  const department = query.data?.data;

  const isLoading = query.isLoading || query.isFetching;

  const form = useForm<Department, HttpError, z.infer<typeof departmentSchema>>(
    {
      resolver: zodResolver(departmentSchema),
      refineCoreProps: {
        resource: "departments",
        action: "edit",
        id,
      },
    },
  );

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  useEffect(() => {
    if (department) {
      reset(department);
    }
  }, [department, reset]);

  const onSubmit = async (values: z.infer<typeof departmentSchema>) => {
    await onFinish(values);
  };

  return (
    <EditView>
      <EditViewHeader resource="departments" title="Edit Department" />
      <div className="intro-row">
        <p>Update department details and description.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>
      <Separator />
      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader>
            {isLoading ? (
              <Skeleton className="h-6 w-1/3" />
            ) : (
              <CardTitle>Department settings</CardTitle>
            )}
          </CardHeader>
          <Separator />
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ) : (
                  <>
                    <FormField
                      control={control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Department Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    "Save changes"
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

export default DepartmentsEdit;
