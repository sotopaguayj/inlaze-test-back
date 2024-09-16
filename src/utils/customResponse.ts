import { HttpStatus } from "@nestjs/common";

export interface CustomResponse {
  status: HttpStatus;
  message: string;
  [key: string]: any;
}
