import { Module } from '@nestjs/common';
import { IUserServiceProvider } from '../core/primary-ports/user.service.interface';
import { UserService } from '../core/services/user.service';
import { AuthenticationHelper } from '../infrastructure/security/authentication.helper';
import { UserGateway } from './gateways/user.gateway';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../infrastructure/data-source/postgres/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [{provide: IUserServiceProvider, useClass: UserService}, UserGateway, AuthenticationHelper],
  controllers: [UserController],
  exports: [IUserServiceProvider]

})
export class UserModule {
}
