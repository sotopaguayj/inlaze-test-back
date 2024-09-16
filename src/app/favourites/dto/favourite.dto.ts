import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FavouriteDto {
  @IsString({ message: "userId must be a string" })
  @IsNotEmpty({ message: "userId should not be empty" })
  @ApiProperty({
    name: "userId",
    type: "string - CUID",
    example: "cm12hvxib0000b63royy9pjtw",
    description: "User id",
    required: true,
  })
  userId: string;

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
