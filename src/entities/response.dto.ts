import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class MomentResponseDTO {
  @ApiProperty({ format: "YYYY-MM-DDTHH:MM:SS" })
  datetime: Date;

  @ApiProperty()
  status: boolean;
}

export class LoopResponseDTO {
  @ApiProperty()
  weeks: number;

  @ApiProperty()
  days: number;

  @ApiProperty()
  hours: number;

  @ApiProperty()
  minutes: number;
}

export class UsbResponseDTO {
  @ApiProperty()
  bus: string;

  @ApiProperty()
  device: string;
}

export class StatusResponseDTO {
  @ApiProperty()
  socket: number;

  @ApiProperty()
  status: boolean;
}

export class ScheduleResponseDTO {
  @ApiProperty()
  socket: number;

  @ApiProperty({ format: "YYYY-MM-DDTHH:MM:SS" })
  modifiedAt: Date;

  @ApiProperty({ type: [MomentResponseDTO] })
  moments: MomentResponseDTO[];

  @IsOptional()
  @ApiProperty({ type: [LoopResponseDTO], required: false })
  loop?: LoopResponseDTO;
}

export class DeviceResponseDTO {
  @ApiProperty({ type: UsbResponseDTO })
  usbInformation: UsbResponseDTO;

  @ApiProperty()
  deviceType: string;

  @ApiProperty()
  serialNumber: string;
}
