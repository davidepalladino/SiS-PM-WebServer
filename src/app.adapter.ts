import { Injectable } from '@nestjs/common';
import { ISocket } from './app.entities';

@Injectable()
export class AppAdapter {
  adaptStatuses(res: string): ISocket[] {
    return res.match(/(on|off)/g).map(
      (result, index) =>
        ({
          socket: index + 1,
          status: result === 'on',
        } as ISocket),
    );
  }
}
