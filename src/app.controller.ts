import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Put,
  ValidationPipe
} from "@nestjs/common";
import { AppService } from "./app.service";
import { ScheduleRequestDTO, StatusRequestDTO } from "./entities/request.dto";

@Controller("/api")
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
  @Header("Content-Type", "application/json")
  setStatus(@Param("id") socketId: number, @Body() body: StatusRequestDTO) {
    return this.appService.setStatus(socketId, body.status);
  }

  @Get("/schedule/:id")
  getSchedule(@Param("id") socketId: number) {
    return this.appService.getSchedule(socketId);
  }

  @Put("/schedule/:id")
  @Header("Content-Type", "application/json")
  setSchedule(
    @Param("id") socketId: number,
    @Body(new ValidationPipe({ transform: true })) body: ScheduleRequestDTO
  ) {
    return this.appService.setSchedule(socketId, body);
  }

  @Get("/device")
  getDevice() {
    return this.appService.getDevice();
  }
}
