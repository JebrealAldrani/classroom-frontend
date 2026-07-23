import {useMemo, useState} from "react";
import {useTable} from "@refinedev/react-table";
import {Class} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/ui/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";

const List = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const searchFilters = searchQuery ? [
        {field: 'name', operator: 'contains' as const, value: searchQuery},
    ] : [];

    const classesTable = useTable<Class>({
        columns: useMemo<ColumnDef<Class>[]>(() => [
            {
                id: 'name',
                accessorKey: 'name',
                size: 220,
                header: () => <p className="column-title">Name</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground font-medium">
                    {getValue<string>()}
                </span>
                ),
                filterFn: 'includesString'
            },
            {
                id: 'subject',
                accessorKey: 'subject.name',
                size: 180,
                header: () => <p className="column-title">Subject</p>,
                cell: ({getValue}) => (
                    <Badge variant="secondary">
                        {getValue<string>()}
                    </Badge>
                )
            },
            {
                id: 'teacher',
                accessorKey: 'user.name',
                size: 180,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground">
                    {getValue<string>()}
                </span>
                )
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 120,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({getValue}) => (
                    <Badge variant="outline">
                        {getValue<number>()}
                    </Badge>
                )
            },
            {
                id: 'status',
                accessorKey: 'status',
                size: 120,
                header: () => <p className="column-title">Status</p>,
                cell: ({getValue}) => (
                    <Badge
                        variant={
                            getValue<string>() === 'active'
                                ? 'default'
                                : 'secondary'
                        }
                    >
                        {getValue<string>()}
                    </Badge>
                )
            },
            {
                id: 'inviteCode',
                accessorKey: 'invite_code',
                size: 150,
                header: () => <p className="column-title">Invite Code</p>,
                cell: ({getValue}) => (
                    <Badge variant="outline">
                        {getValue<string>()}
                    </Badge>
                )
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({getValue}) => (
                    <span className="truncate line-clamp-2">
                    {getValue<string>()}
                </span>
                )
            }
        ], []),
        refineCoreProps: {
            resource: 'classes',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            filters: {
                permanent: [...searchFilters]
            },
            sorters: {
                initial: [
                    {
                        field: 'id',
                        order: 'desc'
                    }
                ]
            }
        }
    });
    return (
        <ListView>
            <Breadcrumb/>
            <h1 className="page-title">Classes</h1>
            <div className="intro-row">
                <p>manage classes in CSM</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon"/>

                        <Input type="text" placeholder="search by name..." className="pl-10 w-full" value={searchQuery}
                               onChange={(e) => {
                                   setSearchQuery(e.target.value)
                               }}></Input>
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

                        <CreateButton className="ml-2"/>
                    </div>
                </div>
            </div>

            <DataTable table={classesTable}/>
        </ListView>
    )
}
export default List
