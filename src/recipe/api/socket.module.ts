import { Module } from '@nestjs/common';
import { ISocketServiceProvider } from '../core/primary-ports/socket.service.interface';
import { SocketService } from '../core/services/socket.service';
import { RecipeGateway } from './gateways/recipe.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [{provide: ISocketServiceProvider, useClass: SocketService}, RecipeGateway],
  exports: [ISocketServiceProvider]
})
export class SocketModule {}
