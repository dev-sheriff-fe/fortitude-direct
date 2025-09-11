import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils';

const axiosInstanceNoAuth = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app:8008/mmcp/api/v1',
  headers: {
    'x-source-code': 'HELP2PAY',
     'x-client-id': 'TST03054745785188010772',
    'x-client-secret': 'TST03722175625334233555707073458615741827171811840881'
  },
});

export default axiosInstanceNoAuth