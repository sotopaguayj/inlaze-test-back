import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  Req,
  Request as Rqst,
  UseGuards,
} from "@nestjs/common";
import { SingInDto } from "./dto/auth.dto";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { UserDto } from "../users/dto/user.dto";
import { AuthGuard } from "./auth.guard";
import { Public } from "./decorators/public.decorator";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("singin")
  @ApiOperation({ summary: "Access to server app" })
  @ApiBody({
    type: SingInDto,
    description: "Signin data",
    examples: {
      valid: {
        value: {
          email: "jhon@doe.com",
          password: "123456",
        },
      },
      invalid: {
        value: {
          email: "lorem#ipsum,com",
          password: "123",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Login successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid password",
  })
  async singIn(@Body() body: SingInDto, @Res() res: Response, @Req() req: Request) {
    try {
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const { status, ...rest } = await this.authService.singIn(body, userAgent, ip);
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post("singup")
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({
    type: UserDto,
    description: "Signup data",
    examples: {
      a: {
        value: {
          name: "jhon",
          userName: "Doeh",
          email: "jhon@doe.com",
          password: "123456",
        },
      },
      b: {
        value: {
          name: "lorem",
          userName: "ipsum",
          email: "lorem@ipsum.com",
          password: "654321",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User created successfully",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "User already created",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async singUp(@Body() body: UserDto, @Res() res: Response) {
    try {
      const { status, ...rest } = await this.authService.singUp(body);
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("singout")
  @ApiOperation({ summary: "Signout session" })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Logout successfully",
  })
  async singOut(@Rqst() req, @Res() res: Response) {
    const expires = req.user.exp;
    const token = req.headers.authorization.split(" ")[1];
    try {
      const { status, ...rest } = await this.authService.singOut(token, expires);
      return res.status(status).json(rest);
    } catch (error) {
      throw new HttpException(
        "Error del servidor, intente nuevamente",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
