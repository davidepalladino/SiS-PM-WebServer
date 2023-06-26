import { IMomentResponse } from "./entities";

export class StatusResponseDTO {
  socket: number;

  status: boolean;
}

export class ScheduleResponseDTO {
  socket: number;
  modifiedAt: Date;
  moments: IMomentResponse[];
  loopMinutes?: number;
}
