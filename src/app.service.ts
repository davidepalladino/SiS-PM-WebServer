import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ConfigService } from '@nestjs/config';
import { IExec } from './app.entities';

@Injectable()
export class AppService {
  private command = this.configService.get<string>('CMD');
  private execute = promisify(exec);

  constructor(private configService: ConfigService) {}

  getStatus(): Observable<IExec> {
    return this.executeCommand('-g all');
  }

  private executeCommand(arg: string) {
    return fromPromise(
      this.execute(`${this.command} ${arg}`).then(({ stdout, stderr }) => {
        return { stdout, stderr } as IExec;
      }),
    );
  }
}
