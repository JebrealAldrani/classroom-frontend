import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useTable } from "@refinedev/react-table";
import { Class } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { DeleteButton } from "@/components/refine-ui/buttons/delete.tsx";
import { EditButton } from "@/components/refine-ui/buttons/edit.tsx";
import { ShowButton } from "@/components/refine-ui/buttons/show.tsx";
import DeleteSelectedButton from "@/components/refine-ui/buttons/delete-selected";
import { useGo, useList } from "@refinedev/core";
import { Checkbox } from "@/components/ui/checkbox";
import type { User, Subject } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENT_OPTIONS } from "@/constants";

const List = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("ClassSearch") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

  //Select Filters For Teacher and Subject
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    pagination: { pageSize: 1000 },
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
  });
  const teachers = teachersQuery.data?.data ?? [];

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 1000 },
  });
  const subjects = subjectsQuery.data?.data ?? [];

  const teacherFilter =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacherId",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ];

  const subjectFilter =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subjectId",
            operator: "eq" as const,
            value: selectedSubject,
          },
        ];

  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("ClassSearch", value.trim());
    } else {
      nextParams.delete("ClassSearch");
    }
    setSearchParams(nextParams);
  };

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const classesTable = useTable<Class>({
    enableRowSelection: true,
    //to make the table know the checked row based on id of that row not index
    getRowId: (row) => row.id.toString(),
    columns: useMemo<ColumnDef<Class>[]>(
      () => [
        {
          id: "select",
          size: 40,
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={`Select ${row.original.name}`}
            />
          ),
        },
        {
          id: "name",
          accessorKey: "name",
          size: 220,
          header: () => <p className="column-title ml-2">Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground font-medium">
              {getValue<string>()}
            </span>
          ),
          filterFn: "includesString",
        },
        {
          id: "status",
          accessorKey: "status",
          size: 120,
          header: () => <p className="column-title">Status</p>,
          cell: ({ getValue }) => (
            <Badge
              variant={
                getValue<string>() === "active" ? "default" : "secondary"
              }
            >
              {getValue<string>()}
            </Badge>
          ),
        },
        {
          id: "subject",
          accessorKey: "subject.name",
          size: 180,
          header: () => <p className="column-title">Subject</p>,
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "teacher",
          accessorKey: "user.name",
          size: 180,
          header: () => <p className="column-title">Teacher</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 120,
          header: () => <p className="column-title">Capacity</p>,
          cell: ({ getValue }) => (
            <Badge variant="outline">{getValue<number>()}</Badge>
          ),
        },
        {
          id: "details",
          size: 180,
          header: () => <p className="column-title">Actions</p>,
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <ShowButton
                resource="classes"
                recordItemId={row.original.id}
                variant="outline"
                size="sm"
              >
                View
              </ShowButton>
              <EditButton
                resource="classes"
                recordItemId={row.original.id}
                variant="outline"
                size="sm"
              >
                Edit
              </EditButton>
              <DeleteButton
                resource="classes"
                recordItemId={row.original.id}
                variant="destructive"
                size="sm"
              >
                Delete
              </DeleteButton>
            </div>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...teacherFilter, ...subjectFilter, ...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  const go = useGo();

  const handleRowDoubleClick = (classItem: Class) => {
    console.log(classItem);
    go({
      to: {
        resource: "classes",
        action: "show",
        id: classItem.id,
      },
    });
  };

  useEffect(() => {
    classesTable.refineCore.setCurrentPage(1);
  }, [selectedSubject, selectedTeacher]);

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>
      <div className="intro-row">
        <p>manage classes in CSM</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex w-full gap-3 flex-wrap sm:w-auto">
            <div className="flex gap-2">
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem value={teacher.id.toString()} key={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjectss</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem value={subject.id.toString()} key={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <DeleteSelectedButton table={classesTable} resource="classes" />
              <CreateButton className="" />
            </div>
          </div>
        </div>
      </div>

      <DataTable table={classesTable} onRowDoubleClick={handleRowDoubleClick} />
    </ListView>
  );
};
export default List;
