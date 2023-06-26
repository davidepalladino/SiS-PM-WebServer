import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive
} from "class-validator";

export enum ETypeMoment {
  DATETIME = "DATETIME",
  MINUTES = "MINUTES"
}

export interface IExecResult {
  stdout: string;
  stderr: string;
}

export class IMomentRequest {
  @IsEnum(ETypeMoment)
  type: ETypeMoment;

  @IsOptional()
  @IsDate()
  datetime?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  minutes?: number;

  status: boolean;
}

export interface IMomentResponse {
  datetime: Date;
  status: boolean;
}
