import { Injectable } from "@nestjs/common";
import {
  DeviceDTO,
  ScheduleResponseDTO,
  StatusResponseDTO
} from "./entities/response.dto";
import { ETypeMoment, IMomentResponse } from "./entities/entities";
import { ScheduleRequestDTO } from "./entities/request.dto";

@Injectable()
export class AppAdapter {
  adaptGetStatuses(statuses: string): StatusResponseDTO[] {
    return statuses.match(/(on|off)/g).map(
      (result, index) =>
        ({
          socket: index + 1,
          status: result === "on"
        } as StatusResponseDTO)
    );
  }

  adaptGetStatus(status: string): StatusResponseDTO {
    return {
      socket: Number(status.match(/(outlet \d)/g)[0].split(" ")[1]),
      status: status.match(/(on|off)/g)[0] === "on"
    } as StatusResponseDTO;
  }

  adaptSetStatus(status?: boolean): string {
    if (status !== undefined) {
      return status ? "o" : "f";
    }

    return "t";
  }

  adaptGetSchedule(schedule: string): ScheduleResponseDTO {
    const scheduleSplit = schedule.split("\n");
    let [, , socket, modifiedAt, ...rest] = scheduleSplit;

    const moments: IMomentResponse[] = [];
    let loopDays: number = undefined;

    socket = socket.match(/\d/)[0];
    modifiedAt = modifiedAt.substring(18) + "+00:00";

    rest.forEach((row) => {
      if (row.includes("switch")) {
        moments.push({
          datetime: new Date(row.substring(5, 21) + ":00+00:00"),
          status: row.substring(29, 31) === "on"
        });
      } else if (row.includes("Loop")) {
        loopDays = Number(row.substring(13, 14));
      }
    });

    return {
      socket: Number(socket),
      modifiedAt: new Date(modifiedAt),
      moments,
      loopMinutes: loopDays
    } as ScheduleResponseDTO;
  }

  adaptSetSchedule(schedule: ScheduleRequestDTO): string {
    let args = "";

    if (schedule.moments && schedule.moments.length) {
      schedule.moments.forEach((moment) => {
        if (moment.type === ETypeMoment.DATETIME && moment.datetime) {
          args += `--Aat "${moment.datetime
            .toString()
            .replace("T", " ")
            .substring(0, 16)}" `;
        } else if (moment.type === ETypeMoment.MINUTES && moment.minutes) {
          args += `----Aafter ${moment.minutes}`;
        }

        if (moment.datetime || moment.minutes) {
          args += `--Ado ${moment.status ? "on" : "off"} `;
        }
      });
    }

    if (schedule.loopMinutes) {
      args += `--Aloop ${schedule.loopMinutes}`;
    }

    return args;
  }

  adaptGetDevice(device: string): DeviceDTO {
    const deviceSplit = device.split("\n");
    console.log(deviceSplit);
    return {
      usbInformation: "deviceSplit[0]",
      deviceType: "deviceSplit[1]",
      serialNumber: "deviceSplit[2]"
    };
  }
}
