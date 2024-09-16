import { IsNotEmpty, IsEmail, MinLength, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class UserDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre no puede estar vacío" })
  @ApiProperty({
    name: "name",
    type: "string",
    description: "user names",
    required: true,
  })
  name: string;

  @IsString({ message: "El nombre de usuario debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre de usuario no puede estar vacío" })
  @ApiProperty({
    name: "username",
    type: "string",
    description: "user username",
    required: true,
  })
  userName: string;

  @IsEmail({}, { message: "El correo electrónico debe ser válido" })
  @ApiProperty({
    name: "email",
    type: "string",
    example: "example@gmail.com",
    description: "user email",
    required: true,
  })
  email: string;

  @IsNotEmpty({ message: "La contraseña no puede estar vacía" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @ApiProperty({
    name: "email",
    type: "string",
    description: "user password",
    required: true,
    minLength: 6,
  })
  password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
