import { Injectable } from "@nestjs/common";
import {
  DeviceDTO,
  ScheduleResponseDTO,
  StatusResponseDTO
} from "./entities/response.dto";
import { ETypeMoment, ILoop, IMomentResponse } from "./entities/entities";
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
    let loop: ILoop = undefined;

    socket = socket.match(/\d/)[0];
    modifiedAt = modifiedAt.substring(18) + "+00:00";

    rest.forEach((row) => {
      if (row.includes("switch")) {
        moments.push({
          datetime: new Date(row.substring(5, 21) + ":00+00:00"),
          status: row.substring(29, 31) === "on"
        });
      } else if (row.includes("Loop")) {
        loop = {
          weeks: row.includes("week")
            ? Number(row.match(/\d{1} (week)/)[0].match(/\d{1}/)[0])
            : 0,
          days: row.includes("day")
            ? Number(row.match(/\d{1} (day)/)[0].match(/\d{1}/)[0])
            : 0,
          hours: row.includes("h")
            ? Number(row.match(/\d{1,2}(h)/)[0].match(/\d{1,2}/)[0])
            : 0,
          minutes: row.includes("min")
            ? Number(row.match(/\d{1,2}(min)/)[0].match(/\d{1,2}/)[0])
            : 0
        };
      }
    });

    return {
      socket: Number(socket),
      modifiedAt: new Date(modifiedAt),
      moments,
      loop
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
    console.log(deviceSplit[1].match(/(bus) \d/g)[0]);
    return {
      usbInformation: {
        bus: deviceSplit[1].match(/(bus) \d{0,3}/g)[0].substring(4),
        device: deviceSplit[1].match(/(device) \d{0,3}/g)[0].substring(7)
      },
      deviceType: deviceSplit[2].substring(18),
      serialNumber: deviceSplit[3].substring(18)
    };
  }
}
