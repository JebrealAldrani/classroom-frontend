import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest"
import {API_URL} from "@/providers/constants.ts";
import {ListResponse} from "@/types";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({resource}) => resource,

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    }
  }
}

const {dataProvider} = createDataProvider(API_URL, options)

export {dataProvider}