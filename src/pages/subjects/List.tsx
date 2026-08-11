import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { DEPARTMENT_OPTIONS } from "@/constants";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Search } from "lucide-react";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table";
import { Subject } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { useGo } from "@refinedev/core";
import { Checkbox } from "@/components/ui/checkbox";
const SubjectsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("SubjectSearch") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("SubjectSearch", value.trim());
    } else {
      nextParams.delete("SubjectSearch");
    }
    setSearchParams(nextParams);
  };

  //Filters for TableData
  const departmentFilters =
    selectedDepartment === "all"
      ? []
      : [
          {
            field: "department",
            operator: "eq" as const,
            value: selectedDepartment,
          },
        ];
  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  //For configure TableData
  const subjectTable = useTable<Subject>({
    enableRowSelection: true,
    columns: useMemo<ColumnDef<Subject>[]>(
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
          id: "code",
          accessorKey: "code",
          size: 100,
          header: () => <p className="column-title ml-2">Code</p>,
          cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
        },
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title">Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
        },
        {
          id: "department",
          accessorKey: "department.name",
          size: 150,
          header: () => <p className="column-title">Department</p>,
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "description",
          accessorKey: "description",
          size: 300,
          header: () => <p className="column-title">Description</p>,
          cell: ({ getValue }) => (
            <span className="truncate line-clamb-2">{getValue<string>()}</span>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "subjects",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...departmentFilters, ...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  const go = useGo();

  const handleRowDoubleClick = (subject: Subject) => {
    console.log(subject);
    go({
      to: {
        resource: "subjects",
        action: "show",
        id: subject.id,
      },
    });
  };
  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Subjects</h1>
      <div className="intro-row">
        <p>Quick access to essential metrics and management tools</p>

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

          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENT_OPTIONS.map((department) => (
                  <SelectItem value={department.value} key={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton className="ml-2" />
          </div>
        </div>
      </div>

      <DataTable table={subjectTable} onRowDoubleClick={handleRowDoubleClick} />
    </ListView>
  );
};
export default SubjectsList;
