export interface ResponseWeb<T> {
  status: string;
  statusCode: number;
  message?: string;
  data: T;
}
