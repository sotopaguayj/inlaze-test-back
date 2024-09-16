import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SingInDto {
  @IsEmail({}, { message: "El email debe ser una dirección de correo válida." })
  @IsNotEmpty({ message: "El email no puede estar vacío." })
  @ApiProperty({
    name: "email",
    type: "string",
    example: "example@gmail.com",
    description: "user Email",
    required: true,
  })
  email: string;

  @IsString({ message: "La contraseña debe ser una cadena de texto." })
  @IsNotEmpty({ message: "La contraseña no puede estar vacía." })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres." })
  @ApiProperty({
    name: "password",
    type: "string",
    example: "123456",
    description: "user Password",
    required: true,
    minLength: 6,
  })
  password: string;
}
