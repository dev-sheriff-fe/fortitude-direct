import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils';

const axiosInstanceNoAuth = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://www.fortitudedirect.com/api/mmcp/api/v1/',
  headers: {
    'x-source-code': 'FORTITUDE',
     'x-client-id': 'TST03054745785188010772',
    'x-client-secret': 'TST03722175625334233555707073458615741827171811840881'
  },
});

export default axiosInstanceNoAuth