export interface IExecResult {
  stdout: string;
  stderr: string;
}

export interface ISocket {
  socket: number;
  status: boolean;
}

export interface IMoment {
  datetime: Date;
  status: boolean;
}

export interface ISchedule {
  socket: number;
  moments: IMoment[];
  loop?: number;
}
