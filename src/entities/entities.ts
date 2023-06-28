export enum ETypeMoment {
  DATETIME = "DATETIME",
  MINUTES = "MINUTES"
}

export interface IBash {
  code: number;
  killed: false;
  signal: any;
  cmd: string;
  stdout: string;
  stderr: string;
}

export interface IMomentResponse {
  datetime: Date;
  status: boolean;
}