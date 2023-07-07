import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";
import { map, Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { AppAdapter } from "./app.adapter";
import {
  DeviceResponseDTO,
  ScheduleResponseDTO,
  StatusResponseDTO
} from "./entities/response.dto";
import { ScheduleRequestDTO } from "./entities/request.dto";
import { IBash } from "./entities/entities";

@Injectable()
export class AppService {
  private execute = promisify(exec);

  constructor(private readonly appAdapter: AppAdapter) {}

  getStatuses(): Observable<StatusResponseDTO[]> {
    return this.executeCommand("-g all").pipe(
      map((response: string) => this.appAdapter.adaptGetStatuses(response))
    );
  }

  getStatus(socketId: number): Observable<StatusResponseDTO> {
    return this.executeCommand(`-g${socketId}`).pipe(
      map((response: string) => this.appAdapter.adaptGetStatus(response))
    );
  }

  setStatus(socketId: number, status?: boolean): Observable<StatusResponseDTO> {
    return this.executeCommand(
      `-${this.appAdapter.adaptSetStatus(status)}${socketId}`
    ).pipe(map((response: string) => this.appAdapter.adaptGetStatus(response)));
  }

  getSchedule(socketId: number): Observable<ScheduleResponseDTO> {
    return this.executeCommand(`-a${socketId}`).pipe(
      map((response: string) => this.appAdapter.adaptGetSchedule(response))
    );
  }

  setSchedule(
    socketId: number,
    schedule: ScheduleRequestDTO
  ): Observable<ScheduleResponseDTO> {
    return this.executeCommand(
      `-A${socketId} ${this.appAdapter.adaptSetSchedule(schedule)}`
    ).pipe(
      map((response: string) => this.appAdapter.adaptGetSchedule(response))
    );
  }

  getDevice(): Observable<DeviceResponseDTO | string> {
    return this.executeCommand(`-s`).pipe(
      map((response: string) => {
        return this.appAdapter.adaptGetDevice(response);
      })
    );
  }

  private executeCommand(arg: string) {
    return fromPromise(
      this.execute(`sispmctl ${arg}`).then((bash: IBash) => {
        console.log(bash);
        return bash.stdout;
      })
    );
  }
}
