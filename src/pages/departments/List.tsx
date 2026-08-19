import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useTable } from "@refinedev/react-table";
import { Department } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { DeleteButton } from "@/components/refine-ui/buttons/delete.tsx";
import { EditButton } from "@/components/refine-ui/buttons/edit.tsx";
import DeleteSelectedButton from "@/components/refine-ui/buttons/delete-selected";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { useGo } from "@refinedev/core";
import { ShowButton } from "@/components/refine-ui/buttons/show.tsx";

const DepartmentsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("DepartmentSearch") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const departmentsTable = useTable<Department>({
    enableRowSelection: true,
    //to make the table know the checked row based on id of that row not index
    getRowId: (row) => row.id.toString(),
    columns: useMemo<ColumnDef<Department>[]>(
      () => [
        {
          id: "select",
          size: 35,
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
          accessorKey: "code",
          size: 120,
          header: () => <p className="column-title">Code</p>,
          cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
        },
        {
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title">Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground font-medium">
              {getValue<string>()}
            </span>
          ),
          filterFn: "includesString",
        },
        {
          accessorKey: "description",
          size: 360,
          header: () => <p className="column-title">Description</p>,
          cell: ({ getValue }) => (
            <span className="truncate line-clamp-2">{getValue<string>()}</span>
          ),
        },
        {
          id: "actions",
          size: 180,
          header: () => <p className="column-title">Actions</p>,
          cell: ({ row }) => (
            <div className="flex justify-center items-center gap-2">
              <EditButton
                resource="departments"
                recordItemId={row.original.id}
                variant="outline"
                size="sm"
              >
                Edit
              </EditButton>
              <DeleteButton
                resource="departments"
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
      resource: "departments",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("DepartmentSearch", value.trim());
    } else {
      nextParams.delete("DepartmentSearch");
    }
    setSearchParams(nextParams);
  };

  //handle double click navigation to department details page
  const go = useGo();

  const handleRowDoubleClick = (department: Department) => {
    console.log(department);
    go({
      to: {
        resource: "departments",
        action: "show",
        id: department.id,
      },
    });
  };

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>
      <div className="intro-row">
        <p>Manage department groups and keep curriculum aligned.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search departments..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DeleteSelectedButton
              table={departmentsTable}
              resource="departments"
            />
            <CreateButton />
          </div>
        </div>
      </div>
      <DataTable
        table={departmentsTable}
        onRowDoubleClick={handleRowDoubleClick}
      />
    </ListView>
  );
};

export default DepartmentsList;
