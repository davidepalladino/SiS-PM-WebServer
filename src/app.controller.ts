import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/statuses")
  getStatuses() {
    return this.appService.getStatuses();
  }

  @Get("/status/:id")
  getStatus(@Param("id") socketId: number) {
    return this.appService.getStatus(socketId);
  }

  @Patch("/status/:id")
  setStatus(@Param("id") socketId: number, @Body() status: boolean) {
    return this.appService.setStatus(socketId, status);
  }

  @Get("/schedule/:id")
  getSchedule(@Param("id") socketId: number) {
    return this.appService.getSchedule(socketId);
  }
}
