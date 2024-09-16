import { HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { UpdateUserDto, UserDto } from "./dto/user.dto";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { CustomResponse } from "../../utils/customResponse";

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async existUser(email: string) {
    return await this.user.findFirst({
      where: {
        email,
      },
    });
  }

  // - Crear Usuario
  async createUser(user: UserDto): Promise<CustomResponse> {
    try {
      const { email, password } = user;
      if (await this.existUser(email))
        return { status: HttpStatus.CONFLICT, message: "Este correo ya tiene una cuenta", email };
      const hashPassword = await bcrypt.hash(password, 10);
      const userCreated = await this.user.create({
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
  // - Encontrar Usuario por ID
  async findUserById(id: string): Promise<CustomResponse> {
    try {
      const user = await this.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) return { status: HttpStatus.NOT_FOUND, message: "Usuario no encontrado" };
      return {
        status: HttpStatus.OK,
        message: "Usuario encontrado",
        data: user,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al buscar el usuario",
        error: error.message,
      };
    }
  }
  // - Encontrar Todos los Usuarios
  async findAllUsers(): Promise<CustomResponse> {
    try {
      const users = await this.user.findMany();
      const total = await this.user.count();
      return {
        status: HttpStatus.OK,
        message: `Total usuarios: ${total}`,
        data: users,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al buscar los usuarios",
        error: error.message,
      };
    }
  }
  // - Actualizar Usuario:
  async updateUser(id: string, user: UpdateUserDto): Promise<CustomResponse> {
    try {
      const { status, message } = await this.findUserById(id);
      if (status !== HttpStatus.OK) return { status, message };
      const userUpdated = await this.user.update({
        where: {
          id,
        },
        data: user,
      });
      return {
        status: HttpStatus.OK,
        message: "Usuario actualizado correctamente",
        data: userUpdated,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al actualizar el usuario",
        error: error.message,
      };
    }
  }
  // - Soft Delete Usuario
  async deleteUser(id: string): Promise<CustomResponse> {
    try {
      const { status, message } = await this.findUserById(id);
      if (status !== HttpStatus.OK) return { status, message };
      const userDeleted = await this.user.update({
        where: {
          id,
        },
        data: {
          available: false,
        },
      });

      return {
        status: HttpStatus.NO_CONTENT,
        message: "Usuario eliminado correctamente",
        data: userDeleted,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al eliminar el usuario",
        error: error.message,
      };
    }
  }
}
