import { IsArray, IsBoolean, IsNumber, IsPositive } from "class-validator";
import { IMomentRequest } from "./entities";

export class StatusRequestDTO {
  @IsBoolean()
  status: boolean;
}

export class ScheduleRequestDTO {
  @IsArray()
  moments?: IMomentRequest[];

  @IsNumber()
  @IsPositive()
  loopMinutes?: number;
}
