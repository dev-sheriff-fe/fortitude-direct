import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils-customer';

const axiosCustomer = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app:8008/mmcp/api/v1',
  headers: {
    'x-source-code': process.env.NEXT_PUBLIC_SOURCE_CODE || 'HELP2PAY',
    'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772',
    'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881'
  },
});
async function getSessionToken() {
  const token = window.localStorage.getItem('token_customer');
  if (token) {
    return token;
  }
}
async function getToken() {
  if (typeof window !== 'undefined' && window.localStorage.getItem('token_customer')) {
    const storedSession = window.localStorage.getItem('token_customer');
    return storedSession ? storedSession : await getSessionToken();
  }
  return null;
}

axiosCustomer.interceptors.request.use(async function (config) {
  const token = await getToken();

  if (token && !config.url?.includes('customer-login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosCustomer.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    if (error.response?.request.responseURL?.includes('customer-login')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    } else {
      return Promise.reject(error);
    }
  }
);
export default axiosCustomer;
