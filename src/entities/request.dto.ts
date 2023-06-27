import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive
} from "class-validator";
import { IMomentRequest } from "./entities";

export class StatusRequestDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class ScheduleRequestDTO {
  @IsOptional()
  @IsArray()
  moments?: IMomentRequest[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  loopMinutes?: number;
}
