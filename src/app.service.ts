import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";
import { catchError, map, Observable, tap } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { AppAdapter } from "./app.adapter";
import {
  DeviceDTO,
  ScheduleResponseDTO,
  StatusResponseDTO
} from "./entities/response.dto";
import { IExecResult } from "./entities/entities";
import { ScheduleRequestDTO } from "./entities/request.dto";

@Injectable()
export class AppService {
  private execute = promisify(exec);

  constructor(private readonly appAdapter: AppAdapter) {}

  getStatuses(): Observable<StatusResponseDTO[]> {
    return this.executeCommand("-g all").pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetStatuses(response.stdout)
      )
    );
  }

  getStatus(socketId: number): Observable<StatusResponseDTO> {
    return this.executeCommand(`-g${socketId}`).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetStatus(response.stdout)
      )
    );
  }

  setStatus(socketId: number, status?: boolean): Observable<StatusResponseDTO> {
    return this.executeCommand(
      `-${this.appAdapter.adaptSetStatus(status)}${socketId}`
    ).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetStatus(response.stdout)
      )
    );
  }

  getSchedule(socketId: number): Observable<ScheduleResponseDTO> {
    return this.executeCommand(`-a${socketId}`).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetSchedule(response.stdout)
      )
    );
  }

  setSchedule(
    socketId: number,
    schedule: ScheduleRequestDTO
  ): Observable<ScheduleResponseDTO> {
    return this.executeCommand(
      `-A${socketId} ${this.appAdapter.adaptSetSchedule(schedule)}`
    ).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetSchedule(response.stdout)
      )
    );
  }

  getDevice(): Observable<DeviceDTO | string> {
    return this.executeCommand(`-s`).pipe(
      tap(console.log),
      map((response: IExecResult) => {
        if (response.stdout.includes("Check USB connections, please!")) {
          return response.stdout;
        }

        return this.appAdapter.adaptGetDevice(response.stdout);
      }),
      catchError((err: IExecResult) => {
        return err.stderr;
      })
    );
  }

  private executeCommand(arg: string) {
    const command = `sispmctl ${arg}`;

    console.log(command);

    return fromPromise(
      this.execute(command).then(({ stdout, stderr }) => {
        return { stdout, stderr } as IExecResult;
      })
    );
  }
}
