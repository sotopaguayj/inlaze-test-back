import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from "./users/users.service";
import { UsersController } from "./users/users.controller";
import { FavouritesController } from "./favourites/favourites.controller";
import { FavouritesService } from "./favourites/favourites.service";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, UsersController, FavouritesController],
  providers: [AppService, UsersService, FavouritesService],
})
export class AppModule {}
