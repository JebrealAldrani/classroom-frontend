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
import { ShowButton } from "@/components/refine-ui/buttons/show.tsx";
import { useGo } from "@refinedev/core";
import { Checkbox } from "@/components/ui/checkbox";

const List = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("ClassSearch") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

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

        // {
        //     id: 'inviteCode',
        //     accessorKey: 'inviteCode',
        //     size: 150,
        //     header: () => <p className="column-title">Invite Code</p>,
        //     cell: ({getValue}) => (
        //         <Badge variant="outline">
        //             {getValue<string>()}
        //         </Badge>
        //     )
        // },
        // {
        //     id: 'description',
        //     accessorKey: 'description',
        //     size: 250,
        //     header: () => <p className="column-title">Description</p>,
        //     cell: ({getValue}) => (
        //         <span className="truncate line-clamp-2">
        //         {getValue<string>()}
        //     </span>
        //     )
        // },
        {
          id: "details",
          size: 140,
          header: () => <p className="column-title">Details</p>,
          cell: ({ row }) => (
            <ShowButton
              resource="classes"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
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
        permanent: [...searchFilters],
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
        resource: "class",
        action: "show",
        id: classItem.id,
      },
    });
  };

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

          <div className="flex gap-2 w-full sm:w-auto">
            {/*<Select*/}
            {/*    value={selectedDepartment}*/}
            {/*    onValueChange={setSelectedDepartment}*/}
            {/*>*/}
            {/*    <SelectTrigger>*/}
            {/*        <SelectValue placeholder="Filter by department"/>*/}
            {/*    </SelectTrigger>*/}
            {/*    <SelectContent>*/}
            {/*        <SelectItem value="all">All Departments</SelectItem>*/}
            {/*        {DEPARTMENT_OPTIONS.map(department => (*/}
            {/*            <SelectItem value={department.value}*/}
            {/*                        key={department.value}>{department.label}</SelectItem>*/}
            {/*        ))}*/}
            {/*    </SelectContent>*/}
            {/*</Select>*/}

            <CreateButton className="ml-2" />
          </div>
        </div>
      </div>

      <DataTable table={classesTable} onRowDoubleClick={handleRowDoubleClick} />
    </ListView>
  );
};
export default List;
