import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CuidValidationPipe implements PipeTransform {
  private readonly idPattern = /^cm12[a-z0-9]{20}$/;

  transform(value: any) {
    if (typeof value !== "string") {
      throw new BadRequestException("ID must be a string");
    }

    if (!this.idPattern.test(value)) {
      throw new BadRequestException("ID must be a valid CUID");
    }
    return value;
  }
}
