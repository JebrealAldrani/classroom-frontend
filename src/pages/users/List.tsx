import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table";
import { Subject, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGo } from "@refinedev/core";
import { Checkbox } from "@/components/ui/checkbox";

const UsersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("UserSearch") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("UserSearch", value.trim());
    } else {
      nextParams.delete("UserSearch");
    }
    setSearchParams(nextParams);
  };

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const usersTable = useTable<User>({
    columns: useMemo<ColumnDef<User>[]>(
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
          accessorKey: "image",
          header: () => <p className="column-title">User</p>,
          size: 80,
          cell: ({ row }) => {
            const user = row.original;

            return (
              <Avatar>
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback>
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            );
          },
          enableSorting: false,
        },
        {
          accessorKey: "name",
          header: () => <p className="column-title">Name</p>,
          size: 220,
          cell: ({ getValue }) => (
            <span className="font-medium">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
        },
        {
          accessorKey: "email",
          header: () => <p className="column-title">Email</p>,
          size: 280,
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
          filterFn: "includesString",
        },
        {
          accessorKey: "role",
          header: () => <p className="column-title">Role</p>,
          size: 140,
          cell: ({ getValue }) => (
            <Badge variant="outline" className="capitalize">
              {getValue<string>()}
            </Badge>
          ),
        },
        {
          accessorKey: "emailVerified",
          header: () => <p className="column-title">Verified</p>,
          size: 120,
          cell: ({ getValue }) =>
            getValue<boolean>() ? (
              <Badge className="bg-green-500">Verified</Badge>
            ) : (
              <Badge variant="destructive">Unverified</Badge>
            ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "users",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  const go = useGo();

  const handleRowDoubleClick = (user: User) => {
    console.log(user);
    go({
      to: {
        resource: "users",
        action: "show",
        id: user.id,
      },
    });
  };

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Users</h1>
      <div className="intro-row">
        <p>Manage USers in CMS</p>

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

      <DataTable table={usersTable} onRowDoubleClick={handleRowDoubleClick} />
    </ListView>
  );
};
export default UsersList;
