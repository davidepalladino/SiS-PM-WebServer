import { Injectable } from "@nestjs/common";
import { IMoment, ISchedule, ISocket } from "./app.entities";

@Injectable()
export class AppAdapter {
  adaptStatuses(response: string): ISocket[] {
    return response.match(/(on|off)/g).map(
      (result, index) =>
        ({
          socket: index + 1,
          status: result === "on"
        } as ISocket)
    );
  }

  adaptGetStatus(response: string): ISocket {
    return {
      socket: Number(response.match(/(outlet \d)/g)[0].split(" ")[1]),
      status: response.match(/(on|off)/g)[0] === "on"
    } as ISocket;
  }

  adaptSetStatus(request: boolean): string {
    return request ? "o" : "f";
  }

  adaptGetSchedule(response: string): ISchedule {
    const splitResponse = response.split("\n");
    let [, , socket, modifiedAt, ...rest] = splitResponse;

    const moments: IMoment[] = [];
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
      loopDays
    } as ISchedule;
  }
}
