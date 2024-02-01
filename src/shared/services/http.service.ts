import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const httpsService = axios.create();

httpsService.interceptors.request.use((config: AxiosRequestConfig): any => {
  const accessToken = ''; // Add your access token logic here
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
});

httpsService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error('Error', error.response.data);
      console.error('Error', error.response.status);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error('Error', error.message);
    }

    return Promise.reject(error);
  },
);

export default httpsService;
