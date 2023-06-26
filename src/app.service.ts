import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";
import { map, Observable, tap } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { ConfigService } from "@nestjs/config";
import { IExecResult, ISchedule, ISocket } from "./app.entities";
import { AppAdapter } from "./app.adapter";

@Injectable()
export class AppService {
  private command = this.configService.get<string>("CMD");
  private execute = promisify(exec);

  constructor(
    private configService: ConfigService,
    private readonly appAdapter: AppAdapter
  ) {}

  getStatuses(): Observable<ISocket[]> {
    return this.executeCommand("-g all").pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptStatuses(response.stdout)
      )
    );
  }

  getStatus(socketId: number): Observable<ISocket> {
    return this.executeCommand(`-g${socketId}`).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetStatus(response.stdout)
      )
    );
  }

  setStatus(socketId: number, status: string): Observable<ISocket> {
    return this.executeCommand(
      `-${this.appAdapter.adaptSetStatus(status)}${socketId}`
    ).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetStatus(response.stdout)
      )
    );
  }

  getSchedule(socketId: number): Observable<ISchedule> {
    return this.executeCommand(`-a${socketId}`).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetSchedule(response.stdout)
      )
    );
  }

  private executeCommand(arg: string) {
    return fromPromise(
      this.execute(`${this.command} ${arg}`).then(({ stdout, stderr }) => {
        return { stdout, stderr } as IExecResult;
      })
    );
  }
}
