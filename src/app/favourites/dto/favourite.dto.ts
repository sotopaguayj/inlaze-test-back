import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FavouriteDto {
  @IsString({ message: "movieId must be a string" })
  @IsNotEmpty({ message: "movieId should not be empty" })
  @ApiProperty({
    name: "movieId",
    type: "string",
    example: "123asd",
    description: "Movie id",
    required: true,
  })
  movieId: string;
}
