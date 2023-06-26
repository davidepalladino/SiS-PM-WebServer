import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { ConfigService } from "@nestjs/config";
import { IExecResult } from "./app.entities";

@Injectable()
export class AppService {
  private command = this.configService.get<string>("CMD");
  private execute = promisify(exec);

  constructor(private configService: ConfigService) {}

  getStatuses(): Observable<IExecResult> {
    return this.executeCommand("-g all");
  }

  getStatus(socketId: number): Observable<IExecResult> {
    return this.executeCommand(`-g${socketId}`);
  }

  getSchedule(socketId: number): Observable<IExecResult> {
    return this.executeCommand(`-a${socketId}`);
  }

  private executeCommand(arg: string) {
    return fromPromise(
      this.execute(`${this.command} ${arg}`).then(({ stdout, stderr }) => {
        return { stdout, stderr } as IExecResult;
      })
    );
  }
}
