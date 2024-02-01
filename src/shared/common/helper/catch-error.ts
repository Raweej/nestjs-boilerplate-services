import { HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export const extractError = (
  err: AxiosError | any,
  customStatusCode?: number,
) => {
  console.log('Extract Error ====>', err.message);

  const errorStatus =
    customStatusCode ||
    err.response?.status ||
    err.status ||
    HttpStatus.INTERNAL_SERVER_ERROR;

  const errMassage =
    err.response?.data?.errorMessage ||
    err.response?.data?.error_description ||
    err.response?.data?.returnStatus ||
    err.response?.data?.errors?.map((e) => e.errorSource || e.errorReason) ||
    // Other cases
    err.response?.data?.message ||
    err.response?.message ||
    err.message ||
    err ||
    'Internal Server Error';

  const formatMsg = Array.isArray(errMassage)
    ? errMassage.join(', ')
    : errMassage;
  return { message: formatMsg, status: errorStatus, data: err['data'] };
};
