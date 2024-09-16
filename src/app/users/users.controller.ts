import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { UpdateUserDto, UserDto } from "./dto/user.dto";
import { Response } from "express";
import { UsersService } from "./users.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@Controller("users")
@ApiBearerAuth()
@ApiTags("Users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // - Endpoint para crear un nuevo usuario.
  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({
    type: UserDto,
    description: "User data",
    examples: {
      Valid: {
        value: {
          name: "string",
          userName: "string",
          email: "string",
          password: "string",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User created successfully",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async addUser(@Body() body: UserDto, @Res() res: Response) {
    try {
      const { status, ...rest } = await this.usersService.createUser(body);
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // - Endpoint para obtener los detalles de un usuario por su ID.
  @Get(":id")
  @ApiOperation({ summary: "Returns a user" })
  @ApiParam({
    name: "id",
    type: String,
    description: "The ID of the user to retrieve",
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successfully retrieved the user",
    schema: {
      example: {
        message: "Usuario encontrado",
        data: {
          id: "cm12hvxib0000b63royy9pjtw",
          name: "jhon",
          userName: "Doeh",
          email: "jhon@doe.com",
          password: "$2b$10$NiXD28wAlcwNK1WtJsoXNOY4XPPSTj1Wz37eCT9bDm.qbMp4y4ff6",
          available: true,
          createdAt: "2024-09-14T18:42:48.036Z",
          updatedAt: "2024-09-14T18:42:48.036Z",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async findUserById(@Param("id") id: string, @Res() res: Response) {
    try {
      const { status, ...rest } = await this.usersService.findUserById(id);
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // - Endpoint para obtener una lista de todos los usuarios.
  @Get()
  @ApiOperation({ summary: "Returns all users" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successfully retrieved the list of users",
    schema: {
      example: {
        message: "Total usuarios: 1",
        data: [
          {
            id: "cm12hvxib0000b63royy9pjtw",
            name: "jhon",
            userName: "Doeh",
            email: "jhon@doe.com",
            password: "$2b$10$NiXD28wAlcwNK1WtJsoXNOY4XPPSTj1Wz37eCT9bDm.qbMp4y4ff6",
            available: true,
            createdAt: "2024-09-14T18:42:48.036Z",
            updatedAt: "2024-09-14T18:42:48.036Z",
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async findAllUsers(@Res() res: Response) {
    try {
      const { status, ...rest } = await this.usersService.findAllUsers();
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // - Endpoint para actualizar la información de un usuario.
  @Patch(":id")
  @ApiOperation({ summary: "Update user" })
  @ApiParam({
    name: "id",
    type: String,
    description: "The ID of the user to update",
    required: true,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: "Data to update the user",
    examples: {
      Valid: {
        value: {
          name: "string",
          userName: "string",
          email: "string",
          password: "string",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User successfully updated",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid data provided",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto, @Res() res: Response) {
    try {
      const { status, ...rest } = await this.usersService.updateUser(id, body);
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // - Endpoint para realizar un soft delete de un usuario (marcarlo como eliminado sin eliminarlo físicamente de la base de datos).
  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({
    name: "id",
    type: String,
    description: "The ID of the user to delete",
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "User successfully deleted",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async deleteUser(@Param("id") id: string, @Res() res: Response) {
    try {
      const { status, ...rest } = await this.usersService.deleteUser(id);
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
