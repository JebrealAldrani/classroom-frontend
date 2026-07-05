import {DataProvider, GetListParams, BaseRecord, GetListResponse} from "@refinedev/core";
import {DUMMY_DATA} from "@/constants";


export const dataProvider: DataProvider = {
    getList: async <TData extends BaseRecord = BaseRecord>({resource}: GetListParams): Promise<GetListResponse<TData>> => {
        if(resource !== 'subjects') {
            return {
                data: [] as TData[],
                total: 0
            }
        }
        return {
            data: DUMMY_DATA as unknown as TData[],
            total: DUMMY_DATA.length
        }
    },

    getOne: async () => {throw new Error('this function is not present in mock')},
    create: async () => {throw new Error('this function is not present in mock')},
    update: async () => {throw new Error('this function is not present in mock')},
    deleteOne: async () => {throw new Error('this function is not present in mock')},

    getApiUrl: () => ""
}
