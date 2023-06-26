import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from './app.service';
import { AppAdapter } from './app.adapter';
import { IExecResult } from './app.entities';
import { map } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appAdapter: AppAdapter,
  ) {}

  @Get('/statuses')
  getStatuses() {
    return this.appService
      .getStatuses();
  }

  @Get('/schedule:id')
  getSchedule(@Param('id') socketId: string) {
    return this.appService
      .getStatuses()
      .pipe(
        map((res: IExecResult) => this.appAdapter.adaptStatuses(res.stdout)),
      );
  }
}
