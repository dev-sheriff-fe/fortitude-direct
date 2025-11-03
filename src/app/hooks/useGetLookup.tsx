
import useCustomer from '@/store/customerStore';
import { LoggedInUser, SelectOption, UserProfile } from '@/types';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export interface LookupOptions {
  id: number;
  categoryCode: string;
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  usageAccess: string;
  status: string;
  entityCode: string;
  countryCode: string;
}

const useGetLookup = (categoryCode: string) => {
  const {customer} = useCustomer()
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || customer?.entityCode || 'FTD';
  const { data: lookupData } = useQuery<AxiosResponse<LookupOptions[]>>({
    queryKey: [categoryCode],
    queryFn: () =>
      axiosCustomer.request({
        url: 'lookupdata/getdatabycategorycode/' + categoryCode,
        method: 'GET',
        params: {
          entityCode: entityCode,
        },
      })
  }    
  );
  const lookupList: SelectOption[] =
    lookupData?.data.map((item) => {
      return {
        id: item.lookupCode,
        name: item.lookupName,
        description: item.lookupDesc,
      };
    }) ?? [];
  return lookupList;
};

export default useGetLookup;
