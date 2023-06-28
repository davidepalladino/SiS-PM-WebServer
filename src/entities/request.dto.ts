import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min
} from "class-validator";
import { ETypeMoment } from "./entities";

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
  @Min(30)
  @Max(82056)
  loopMinutes?: number;
}

class IMomentRequest {
  @IsEnum(ETypeMoment)
  type: ETypeMoment;

  @IsOptional()
  @IsDate()
  datetime?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  minutes?: number;

  @IsBoolean()
  status: boolean;
}
