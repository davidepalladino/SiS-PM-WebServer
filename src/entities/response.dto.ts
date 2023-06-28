import { ILoop, IMomentResponse } from "./entities";

export class StatusResponseDTO {
  socket: number;

  status: boolean;
}

export class ScheduleResponseDTO {
  socket: number;
  modifiedAt: Date;
  moments: IMomentResponse[];
  loop?: ILoop;
}

export class DeviceDTO {
  usbInformation: {
    bus: string;
    device: string;
  };
  deviceType: string;
  serialNumber: string;
}
