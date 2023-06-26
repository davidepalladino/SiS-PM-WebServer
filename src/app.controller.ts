import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppAdapter } from "./app.adapter";
import { IExecResult } from "./app.entities";
import { map, tap } from "rxjs";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appAdapter: AppAdapter
  ) {}

  @Get("/statuses")
  getStatuses() {
    return this.appService.getStatuses().pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptStatuses(response.stdout)
      )
    );
  }

  @Get("/schedule/:id")
  getSchedule(@Param("id") socketId: string) {
    return this.appService.getSchedule(socketId).pipe(
      tap(console.log),
      map((response: IExecResult) =>
        this.appAdapter.adaptGetSchedule(response.stdout)
      )
    );
  }
}
