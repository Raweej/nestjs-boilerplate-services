import {
  Catch,
  Logger,
  HttpStatus,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { BaseExceptionFilter } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { extractError } from '@shared/common/helper/catch-error';

interface CustomErrorResponse {
  success: boolean;
  errors: {
    message?: any;
    data?: any;
  };
}

@Catch()
export class ResponseExceptionFilter extends BaseExceptionFilter {
  private logger: Logger = new Logger(ResponseExceptionFilter.name);
  constructor(private configService: ConfigService) {
    super();
  }

  private sendErrorResponse(
    body: CustomErrorResponse,
    status: HttpStatus,
    host: HttpArgumentsHost,
  ) {
    const res = host.getResponse();
    this.logger.error({ status, body });
    return res.status(status).send(body);
  }

  private catchHttpError(exception: Error, host: HttpArgumentsHost) {
    // Axios Error
    if (axios.isAxiosError(exception)) {
      const axiosError = exception as AxiosError;

      return this.sendErrorResponse(
        {
          success: false,
          errors: { data: axiosError.toJSON?.() },
        },
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        host,
      );
    }

    // Exception
    if (exception instanceof HttpException) {
      console.log('Inside of Exception');
      const response = exception.getResponse();
      const status = exception.getStatus();

      if (typeof response === 'string') {
        return this.sendErrorResponse(
          {
            success: false,
            errors: { message: response },
          },
          status,
          host,
        );
      }

      // TODO: response error kind of Array
      // const { message } = response as Record<string, unknown>;

      return this.sendErrorResponse(
        {
          success: false,
          errors: { message: response },
        },
        status,
        host,
      );
    }

    const { message, status, data } = extractError(exception);
    return this.sendErrorResponse(
      {
        success: false,
        errors: { message, data },
      },
      status,
      host,
    );
  }

  catch(exception: Error, host: ArgumentsHost) {
    return this.catchHttpError(exception, host.switchToHttp());
  }
}
