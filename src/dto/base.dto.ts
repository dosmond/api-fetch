export enum ErrorLevel {
  None,
  High,
  Medium,
  Low,
}

export enum ErrorType {
  None,
  Exception,
  Warning,
  Verbose,
  Validation,
  Unauthorized,
  NotFound,
  NoContent,
  RateLimit,
}

export interface AppResponse<T = void> {
  result: T;
  success: boolean;
  message?: string;
  errorLevel?: ErrorLevel;
  errorType?: ErrorType;
  udfValues?: Record<string, string>;
}
