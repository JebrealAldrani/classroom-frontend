import {
  Refine,
  // GitHubBanner,
  // WelcomePage,
  // Authenticated,
} from "@refinedev/core";
// import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  // NavigateToResource,
  // CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "@/providers/data.ts";
// import { Login } from "./pages/login";
// import { Register } from "./pages/register";
// import { ForgotPassword } from "./pages/forgot-password";
// import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
// import { Header } from "./components/refine-ui/layout/header";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";

import DashboardPage from "./pages/Dashboard.tsx";
import { BookOpen, Building, GraduationCap, Home, User } from "lucide-react";
import SubjectsList from "@/pages/subjects/List.tsx";
import SubjectsCreate from "@/pages/subjects/Create.tsx";
import SubjectsEdit from "@/pages/subjects/Edit.tsx";
import SubjectsShow from "@/pages/subjects/Show.tsx";
import ClassesList from "@/pages/classes/List.tsx";
import ClassesCreate from "@/pages/classes/Create.tsx";
import ClassesEdit from "@/pages/classes/Edit.tsx";
import ClassShow from "@/pages/classes/Show.tsx";
import UsersList from "@/pages/users/List.tsx";
import CreateUser from "@/pages/users/Create.tsx";
import UsersEdit from "@/pages/users/Edit.tsx";
import UsersShow from "@/pages/users/Show.tsx";
import DepartmentsList from "@/pages/departments/List.tsx";
import DepartmentsCreate from "@/pages/departments/Create.tsx";
import DepartmentsEdit from "@/pages/departments/Edit.tsx";
import DepartmentsShow from "@/pages/departments/Show.tsx";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        {/* <DevtoolsProvider> */}
        <ThemeProvider>
          <Refine
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider()}
            routerProvider={routerProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "c8JvZt-mXDbdl-77f60J",
            }}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Home",
                  icon: <Home />,
                },
              },
              {
                name: "departments",
                list: "/departments",
                create: "/departments/create",
                show: "departments/show/:id",
                edit: "departments/edit/:id",
                meta: { label: "Departments", icon: <Building /> },
              },
              {
                name: "subjects",
                list: "/subjects",
                create: "/subjects/create",
                show: "subjects/show/:id",
                edit: "subjects/edit/:id",
                meta: { label: "Subjects", icon: <BookOpen /> },
              },
              {
                name: "classes",
                list: "/classes",
                create: "/classes/create",
                show: "classes/show/:id",
                edit: "classes/edit/:id",
                meta: { label: "Classes", icon: <GraduationCap /> },
              },
              {
                name: "users",
                list: "/users",
                create: "/users/create",
                show: "users/show/:id",
                edit: "users/edit/:id",
                meta: { label: "Users", icon: <User /> },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route path={"/"} element={<DashboardPage />} />
                <Route path={"/subjects"}>
                  <Route index element={<SubjectsList />}></Route>
                  <Route path={"create"} element={<SubjectsCreate />}></Route>
                  <Route path={"show/:id"} element={<SubjectsShow />}></Route>
                  <Route path={"edit/:id"} element={<SubjectsEdit />}></Route>
                </Route>

                <Route path={"/classes"}>
                  <Route index element={<ClassesList />} />
                  <Route path="create" element={<ClassesCreate />} />
                  <Route path="show/:id" element={<ClassShow />} />
                  <Route path="edit/:id" element={<ClassesEdit />} />
                </Route>

                <Route path={"/users"}>
                  <Route index element={<UsersList />} />
                  <Route path="create" element={<CreateUser />} />
                  <Route path="show/:id" element={<UsersShow />} />
                  <Route path="edit/:id" element={<UsersEdit />} />
                </Route>
                <Route path={"/departments"}>
                  <Route index element={<DepartmentsList />} />
                  <Route path="create" element={<DepartmentsCreate />} />
                  <Route path="show/:id" element={<DepartmentsShow />} />
                  <Route path="edit/:id" element={<DepartmentsEdit />} />
                </Route>
              </Route>
            </Routes>
            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          {/* <DevtoolsPanel /> */}
        </ThemeProvider>
        {/* </DevtoolsProvider> */}
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
