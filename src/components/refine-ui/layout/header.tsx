import { useEffect, useRef, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router";
import {
  useRefineOptions,
  useActiveAuthProvider,
  useLogout,
  useDataProvider,
} from "@refinedev/core";
import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { UserAvatar } from "@/components/refine-ui/layout/user-avatar";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

type SearchSuggestion = {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  href: string;
};

function DesktopHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dataProvider = useDataProvider();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    let active = true;
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);

      const searchText = query.trim();

      try {
        const [
          usersByNameResponse,
          classesResponse,
          subjectsResponse,
          departmentsResponse,
        ] = await Promise.all([
          dataProvider().getList({
            resource: "users",
            pagination: { mode: "server", pageSize: 5000 },
            filters: [
              { field: "name", operator: "contains", value: searchText },
              { field: "email", operator: "contains", value: searchText }
            ],
          }),
          dataProvider().getList({
            resource: "classes",
            pagination: { mode: "server", pageSize: 5000 },
            filters: [
              { field: "name", operator: "contains", value: searchText },
              { field: "description", operator: "contains", value: searchText },
            ],
          }),
          dataProvider().getList({
            resource: "subjects",
            pagination: { mode: "server", pageSize: 5000 },
            filters: [
              { field: "name", operator: "contains", value: searchText },
            ],
          }),
          dataProvider().getList({
            resource: "departments",
            pagination: { mode: "server", pageSize: 5000 },
            filters: [
              { field: "name", operator: "contains", value: searchText },
            ],
          }),
        ]);

        const usersResponse = {
          data: [
            ...(Array.isArray(usersByNameResponse.data)
              ? usersByNameResponse.data
              : [])
          ],
        };
        if (!active) {
          return;
        }

        const nextSuggestions: SearchSuggestion[] = [];
        const seenUserIds = new Set<string>();

        if (Array.isArray(usersResponse.data)) {
          nextSuggestions.push(
            ...usersResponse.data
              .filter((user: any) => {
                if (seenUserIds.has(user.id)) {
                  return false;
                }
                seenUserIds.add(user.id);
                return true;
              })
              .map((user: any) => ({
                id: user.id,
                title: user.name ?? user.email,
                type: "User",
                subtitle: user.role ? `Role: ${user.role}` : undefined,
                href: `/users/show/${user.id}`,
              })),
          );
        }

        if (Array.isArray(classesResponse.data)) {
          nextSuggestions.push(
            ...classesResponse.data.map((classItem: any) => ({
              id: String(classItem.id),
              title: classItem.name,
              type: "Class",
              subtitle: classItem.status
                ? `Status: ${classItem.status}`
                : classItem.subject?.name
                  ? `Subject: ${classItem.subject.name}`
                  : undefined,
              href: `/classes/show/${classItem.id}`,
            })),
          );
        }

        if (Array.isArray(subjectsResponse.data)) {
          nextSuggestions.push(
            ...subjectsResponse.data.map((subject: any) => ({
              id: String(subject.id),
              title: subject.name,
              type: "Subject",
              subtitle: subject.department?.name
                ? `Department: ${subject.department.name}`
                : undefined,
              href: `/subjects/show/${subject.id}`,
            })),
          );
        }

        if (Array.isArray(departmentsResponse.data)) {
          nextSuggestions.push(
            ...departmentsResponse.data.map((department: any) => ({
              id: String(department.id),
              title: department.name,
              type: "Department",
              subtitle: department.code
                ? `Code: ${department.code}`
                : undefined,
              href: `/departments/show/${department.id}`,
            })),
          );
        }

        setSuggestions(nextSuggestions);
        setIsOpen(nextSuggestions.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query, dataProvider]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDefaultResource = (path: string) => {
    if (path.startsWith("/users")) return "users";
    if (path.startsWith("/classes")) return "classes";
    if (path.startsWith("/subjects")) return "subjects";
    if (path.startsWith("/departments")) return "departments";
    return "users";
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSearch = query.trim();
    const resource = getDefaultResource(location.pathname);

    const nextParams = new URLSearchParams();
    if (nextSearch) {
      nextParams.set("search", nextSearch);
    }

    navigate(
      `/${resource}${nextParams.toString() ? `?${nextParams.toString()}` : ""}`,
    );
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    navigate(suggestion.href);
  };

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-16",
        "shrink-0",
        "items-center",
        "gap-4",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-between",
        "z-40",
      )}
    >
      <form
        ref={containerRef}
        onSubmit={handleSearchSubmit}
        className="relative flex w-full max-w-xl items-center gap-2"
      >
        <Search className="text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search users, classes, subjects..."
          className="w-full"
        />

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover shadow-lg">
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground">
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSuggestionClick(suggestion);
                  }}
                  className="flex w-full flex-col gap-1 border-b last:border-b-0 px-4 py-3 text-left hover:bg-accent"
                >
                  <span className="text-sm font-medium text-foreground">
                    {suggestion.title}
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{suggestion.type}</span>
                    {suggestion.subtitle && <span>{suggestion.subtitle}</span>}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        )}
      </form>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  const { title } = useRefineOptions();

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-12",
        "shrink-0",
        "items-center",
        "gap-2",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-between",
        "z-40",
      )}
    >
      <SidebarTrigger
        className={cn("text-muted-foreground", "rotate-180", "ml-1", {
          "opacity-0": open,
          "opacity-100": !open || isMobile,
          "pointer-events-auto": !open || isMobile,
          "pointer-events-none": open && !isMobile,
        })}
      />

      <div
        className={cn(
          "whitespace-nowrap",
          "flex",
          "flex-row",
          "h-full",
          "items-center",
          "justify-start",
          "gap-2",
          "transition-discrete",
          "duration-200",
          {
            "pl-3": !open,
            "pl-5": open,
          },
        )}
      >
        <div>{title.icon}</div>
        <h2
          className={cn(
            "text-sm",
            "font-bold",
            "transition-opacity",
            "duration-200",
            {
              "opacity-0": !open,
              "opacity-100": open,
            },
          )}
        >
          {title.text}
        </h2>
      </div>

      <ThemeToggle className={cn("h-8", "w-8")} />
    </header>
  );
}

const UserDropdown = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const authProvider = useActiveAuthProvider();

  if (!authProvider?.getIdentity) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon
            className={cn("text-destructive", "hover:text-destructive")}
          />
          <span className={cn("text-destructive", "hover:text-destructive")}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Header.displayName = "Header";
MobileHeader.displayName = "MobileHeader";
DesktopHeader.displayName = "DesktopHeader";
