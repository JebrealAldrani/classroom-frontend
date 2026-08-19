import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest";
import { VITE_BACKEND_BASE_URL } from "@/providers/constants.ts";
import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Failed Request";

  try {
    const payload = (await response.json()) as { message?: string };
    if (payload?.message) message = payload.message;
  } catch {
    //ignore errors
  }

  return {
    message: message,
    statusCode: response.status,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      if (resource === "users") {
        params.current = page;
        params.pageSize = pageSize;
        params.filters = JSON.stringify(filters ?? []);
      }

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "classes") {
          if (field === "status") params.status = value;
          if (field === "name" || field === "description")
            params.search = value;
        }

        if (resource === "departments") {
          if (field === "name" || field === "code") params.search = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.clone().json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();

      return json?.data ?? [];
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();

      return json.data ?? [];
    },
  },

  deleteOne: {
    getEndpoint: ({ resource, id }) => {
      console.log("deleteOne resource:", resource, "id:", id);
      return `${resource}/${id}`;
    },

    // Add required headers for DELETE requests
    buildHeaders: async () => ({
      "Accept-Language": "en-US",
    }),

    // Extract the deleted record from API response
    mapResponse: async (response, params) => {
      const json: any = await response.json();

      // Handle different response formats
      if (params.resource === "categories") {
        return json.result;
      }

      // Some APIs return just success confirmation
      if (json.success && !json.data) {
        // Return minimal record with just the ID for confirmation
        return { id: params.id };
      }

      // Your API wraps the deleted record in a "data" property
      // API returns: { "data": { "id": 123, "title": "Deleted Post" } }
      // Refine needs: { "id": 123, "title": "Deleted Post" }
      return json.data;
    },
  },

  update: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json: any = await response.json();
      return json.data ?? [];
    },
  },
};

const { dataProvider } = createDataProvider(VITE_BACKEND_BASE_URL, options);

export { dataProvider };
