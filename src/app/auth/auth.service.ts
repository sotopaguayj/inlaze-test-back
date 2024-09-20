import { HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { SingInDto } from "./dto/auth.dto";
import { CustomResponse } from "src/utils/customResponse";
import { UserDto } from "../users/dto/user.dto";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super();
  }

  async singIn(body: SingInDto, ua: any, ip: any): Promise<CustomResponse> {
    const { email, password } = body;
    try {
      const user = await this.userService.existUser(email);
      if (!user) return { status: HttpStatus.NOT_FOUND, message: "Usuario no encontrado" };
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return { status: HttpStatus.UNAUTHORIZED, message: "Clave inorrecta" };
      const payload = { sub: user.id, username: user.userName };
      await this.loginTimes.create({
        data: {
          userId: user.id,
          ip,
          userAgent: ua,
        },
      });
      return {
        access_token: await this.jwtService.signAsync(payload),
        status: HttpStatus.OK,
        message: "Inicio de sesion exitoso",
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al iniciar sesion",
      };
    }
  }

  async singUp(user: UserDto): Promise<CustomResponse> {
    try {
      const { email, password } = user;
      if (await this.userService.existUser(email))
        return { status: HttpStatus.CONFLICT, message: "Este correo ya tiene una cuenta", email };
      const hashPassword = await bcrypt.hash(password, 10);
      const userCreated = await this.userService.user.create({
        data: { ...user, password: hashPassword },
      });
      return {
        status: HttpStatus.CREATED,
        message: "Usuario creado correctamente",
        data: userCreated,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al crear el usuario",
        error: error.message,
      };
    }
  }

  async singOut(token: string, expire: number): Promise<CustomResponse> {
    const exp = new Date(expire * 1000);
    try {
      const exit = await this.blacklistedToken.create({
        data: { token, expiresAt: exp },
      });
      this.$disconnect();
      return {
        status: HttpStatus.OK,
        message: "Sesion cerrada correctamente",
        data: exit,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al cerrar sesion",
        error: error.message,
      };
    }
  }

  async validateSession(token: string): Promise<boolean> {
    const session = await this.blacklistedToken.findFirst({ where: { token } });
    return session ? false : true;
  }
}
