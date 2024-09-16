import { HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CustomResponse } from "src/utils/customResponse";
import { FavouriteDto } from "./dto/favourite.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class FavouritesService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor(private readonly userService: UsersService) {
    super();
  }

  async setFavoutite(body: FavouriteDto): Promise<CustomResponse> {
    const { movieId, userId } = body;
    const exist = await this.favourites.findFirst({
      where: {
        movieId,
        userId,
      },
    });
    if (exist) {
      await this.favourites.delete({
        where: {
          id: exist.id,
        },
      });
      return {
        status: HttpStatus.ACCEPTED,
        message: "Eliminado de favoritos",
        movie: exist.movieId,
      };
    }
    try {
      const add = await this.favourites.create({ data: { userId, movieId } });

      return {
        status: HttpStatus.CREATED,
        message: "Agregado a favoritos",
        data: add,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al agregar a favoritos",
        error: error.message,
      };
    }
  }

  async allFavourites(userId: string) {
    try {
      const { status, message } = await this.userService.findUserById(userId);
      if (status !== HttpStatus.OK) return { status, message };
      const all = await this.favourites.findMany({
        where: { userId },
      });
      return {
        status: HttpStatus.ACCEPTED,
        message: "Favoritos obtenidos",
        data: all,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al agregar a favoritos",
        error: error.message,
      };
    }
  }
}
