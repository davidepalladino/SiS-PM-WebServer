export enum ETypeMoment {
  DATETIME = "DATETIME",
  MINUTES = "MINUTES"
}

export interface IExecResult {
  stdout: string;
  stderr: string;
}

export interface IMomentResponse {
  datetime: Date;
  status: boolean;
}
