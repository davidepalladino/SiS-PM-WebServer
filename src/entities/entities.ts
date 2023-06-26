export enum ETypeMoment {
  DATETIME,
  MINUTES
}

export interface IExecResult {
  stdout: string;
  stderr: string;
}

export interface IMomentRequest {
  type: ETypeMoment;
  datetime?: Date;
  minutes?: number;
  status: boolean;
}

export interface IMomentResponse {
  datetime: Date;
  status: boolean;
}
