// import type { AuthProvider } from "@refinedev/core";
// import { VITE_BACKEND_BASE_URL } from "@/providers/constants.ts";

// const authBaseUrl = `${VITE_BACKEND_BASE_URL.replace(/\/$/, "")}/auth`;

// type SessionResponse = {
//   user?: {
//     id: string;
//     name: string;
//     email: string;
//     image?: string | null;
//     role?: string;
//   };
// };

// const request = async (path: string, options?: RequestInit) => {
//   const response = await fetch(`${authBaseUrl}${path}`, {
//     ...options,
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...options?.headers,
//     },
//   });

//   const payload = await response.json().catch(() => ({}));

//   if (!response.ok) {
//     throw new Error(
//       payload.message ?? payload.error ?? "Authentication failed",
//     );
//   }

//   return payload;
// };

// export const authProvider: AuthProvider = {
//   login: async ({ email, password, providerName }) => {
//     if (providerName) {
//       return {
//         success: false,
//         error: new Error("Social login is not configured"),
//       };
//     }

//     await request("/sign-in/email", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });

//     return { success: true, redirectTo: "/" };
//   },

//   register: async ({ email, password, name, role = "student" }) => {
//     await request("/sign-up/email", {
//       method: "POST",
//       body: JSON.stringify({ email, password, name, role }),
//     });

//     return { success: true, redirectTo: "/" };
//   },

//   logout: async () => {
//     await request("/sign-out", { method: "POST" });
//     return { success: true, redirectTo: "/login" };
//   },

//   check: async () => {
//     try {
//       const session = (await request("/get-session")) as SessionResponse;
//       return session.user
//         ? { authenticated: true }
//         : { authenticated: false, redirectTo: "/login" };
//     } catch {
//       return { authenticated: false, redirectTo: "/login" };
//     }
//   },

//   getIdentity: async () => {
//     const session = (await request("/get-session")) as SessionResponse;
//     return session.user ?? null;
//   },

//   onError: async (error) => {
//     if (error.statusCode === 401) {
//       return { logout: true, redirectTo: "/login" };
//     }

//     return { error };
//   },
// };
