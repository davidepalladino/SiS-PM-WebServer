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
import { ApiProperty } from "@nestjs/swagger";
import { ETypeMoment } from "./entities";

export class MomentRequestDTO {
  @IsEnum(ETypeMoment)
  @ApiProperty({ enum: ETypeMoment })
  type: ETypeMoment;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: "Must be set when `type` is se to `DATETIME`",
    format: "YYYY-MM-DDTHH:MM:SS",
    required: false
  })
  datetime?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: "Must be set when `type` is se to `MINUTES`",
    required: false
  })
  minutes?: number;

  @IsBoolean()
  @ApiProperty()
  status: boolean;
}

export class StatusRequestDTO {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  status?: boolean;
}

export class ScheduleRequestDTO {
  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [MomentRequestDTO] })
  moments?: MomentRequestDTO[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(30)
  @Max(82056)
  @ApiProperty({
    minimum: 30,
    maximum: 82056
  })
  loopMinutes?: number;
}
