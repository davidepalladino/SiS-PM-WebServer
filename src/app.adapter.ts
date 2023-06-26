import { Injectable } from "@nestjs/common";
import {
  ScheduleResponseDTO,
  StatusResponseDTO
} from "./entities/response.dto";
import { ETypeMoment, IMomentResponse } from "./entities/entities";
import { ScheduleRequestDTO } from "./entities/request.dto";

@Injectable()
export class AppAdapter {
  adaptStatuses(response: string): StatusResponseDTO[] {
    return response.match(/(on|off)/g).map(
      (result, index) =>
        ({
          socket: index + 1,
          status: result === "on"
        } as StatusResponseDTO)
    );
  }

  adaptGetStatus(response: string): StatusResponseDTO {
    return {
      socket: Number(response.match(/(outlet \d)/g)[0].split(" ")[1]),
      status: response.match(/(on|off)/g)[0] === "on"
    } as StatusResponseDTO;
  }

  adaptSetStatus(status: boolean): string {
    return status ? "o" : "f";
  }

  adaptGetSchedule(response: string): ScheduleResponseDTO {
    const splitResponse = response.split("\n");
    let [, , socket, modifiedAt, ...rest] = splitResponse;

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

  adaptSetSchedule(schedule: ScheduleRequestDTO) {
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

        args += `--Ado ${moment.status ? "on" : "off"} `;
      });
    }

    if (schedule.loopMinutes) {
      args += `--Aloop ${schedule.loopMinutes}`;
    }

    return args;
  }
}
