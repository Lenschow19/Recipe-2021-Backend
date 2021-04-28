import { Module } from '@nestjs/common';
import { IUserServiceProvider } from '../core/primary-ports/user.service.interface';
import { UserService } from '../core/services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../infrastructure/data-source/postgres/entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { AppModule } from '../../app.module';
import { SocketModule } from './socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, SocketModule],
  providers: [{provide: IUserServiceProvider, useClass: UserService}],
  controllers: [UserController],
  exports: [IUserServiceProvider]

})
export class UserModule {
}
