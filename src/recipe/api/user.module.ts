import { Module } from '@nestjs/common';
import { IUserServiceProvider } from '../core/primary-ports/user.service.interface';
import { UserService } from '../core/services/user.service';
import { AuthenticationHelper } from '../../auth/authentication.helper';
import { UserGateway } from './gateways/user.gateway';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../infrastructure/data-source/postgres/entities/user.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  providers: [{provide: IUserServiceProvider, useClass: UserService}, UserGateway],
  controllers: [UserController],
  exports: [IUserServiceProvider]

})
export class UserModule {
}
