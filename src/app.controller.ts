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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from "@nestjs/swagger";
import {
  DeviceResponseDTO,
  ScheduleResponseDTO,
  StatusResponseDTO
} from "./entities/response.dto";

@ApiTags("api")
@Controller("/api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/statuses")
  @ApiOperation({ description: "Get statuses of all sockets." })
  @ApiOkResponse({
    type: [StatusResponseDTO]
  })
  @ApiInternalServerErrorResponse({
    description:
      "DEVICE_NOT_CONNECTED | MISSING_PERMISSION | MISSING_KEYWORD_COMMAND_PERMISSION | MISSING_COMMAND | UNKNOWN"
  })
  getStatuses() {
    return this.appService.getStatuses();
  }

  @Get("/status/:id")
  @ApiOperation({
    description:
      "Get status for a specific socket by its ID, defined as parameter in the URI request."
  })
  @ApiParam({ name: "id", description: "Number of socket" })
  @ApiOkResponse({
    type: StatusResponseDTO
  })
  @ApiBadRequestResponse({
    description: "INCORRECT_SOCKET_NUMBER | GENERIC"
  })
  @ApiInternalServerErrorResponse({
    description:
      "DEVICE_NOT_CONNECTED | MISSING_PERMISSION | MISSING_KEYWORD_COMMAND_PERMISSION | MISSING_COMMAND | UNKNOWN"
  })
  getStatus(@Param("id") socketId: number) {
    return this.appService.getStatus(socketId);
  }

  @Patch("/status/:id")
  @Header("Content-Type", "application/json")
  @ApiOperation({
    description:
      "Set status for a specific socket by its ID, defined as parameter in the URI request. If the body is not set, the status is switched from the actual value."
  })
  @ApiParam({ name: "id", description: "Number of socket" })
  @ApiBody({ type: StatusRequestDTO, required: false })
  @ApiOkResponse({
    type: StatusResponseDTO
  })
  @ApiBadRequestResponse({
    description: "INCORRECT_SOCKET_NUMBER | GENERIC"
  })
  @ApiInternalServerErrorResponse({
    description:
      "DEVICE_NOT_CONNECTED | MISSING_PERMISSION | MISSING_KEYWORD_COMMAND_PERMISSION | MISSING_COMMAND | UNKNOWN"
  })
  setStatus(@Param("id") socketId: number, @Body() body: StatusRequestDTO) {
    return this.appService.setStatus(socketId, body.status);
  }

  @Get("/schedule/:id")
  @ApiOperation({
    description:
      "Get schedule for a specific socket by its ID, defined as parameter in the URI request."
  })
  @ApiParam({ name: "id", description: "Number of socket" })
  @ApiOkResponse({
    type: ScheduleResponseDTO
  })
  @ApiBadRequestResponse({
    description: "INCORRECT_SOCKET_NUMBER | GENERIC"
  })
  @ApiInternalServerErrorResponse({
    description:
      "DEVICE_NOT_CONNECTED | MISSING_PERMISSION | MISSING_KEYWORD_COMMAND_PERMISSION | MISSING_COMMAND | UNKNOWN"
  })
  getSchedule(@Param("id") socketId: number) {
    return this.appService.getSchedule(socketId);
  }

  @Put("/schedule/:id")
  @Header("Content-Type", "application/json")
  @ApiOperation({
    description:
      "Set schedule for a specific socket by its ID, defined as parameter in the URI request. Each `datetime` value must be major of the present."
  })
  @ApiParam({ name: "id", description: "Number of socket" })
  @ApiBody({ type: ScheduleRequestDTO })
  @ApiOkResponse({
    type: ScheduleResponseDTO
  })
  @ApiBadRequestResponse({
    description: "INCORRECT_SOCKET_NUMBER | GENERIC"
  })
  @ApiInternalServerErrorResponse({
    description:
      "DEVICE_NOT_CONNECTED | MISSING_PERMISSION | MISSING_KEYWORD_COMMAND_PERMISSION | MISSING_COMMAND | UNKNOWN"
  })
  setSchedule(
    @Param("id") socketId: number,
    @Body(new ValidationPipe({ transform: true })) body: ScheduleRequestDTO
  ) {
    return this.appService.setSchedule(socketId, body);
  }

  @Get("/device")
  @ApiOperation({
    description: "Get information about device and its connection."
  })
  @ApiOkResponse({
    type: DeviceResponseDTO
  })
  @ApiBadRequestResponse({
    description: "INCORRECT_SOCKET_NUMBER | GENERIC"
  })
  @ApiInternalServerErrorResponse({
    description:
      "DEVICE_NOT_CONNECTED | MISSING_PERMISSION | MISSING_KEYWORD_COMMAND_PERMISSION | MISSING_COMMAND | UNKNOWN"
  })
  getDevice() {
    return this.appService.getDevice();
  }
}
