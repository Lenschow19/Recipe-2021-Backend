import { OnGatewayInit, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Server } from 'socket.io';
import { ISocketService, ISocketServiceProvider } from '../../core/primary-ports/socket.service.interface';

@WebSocketGateway()
export class RecipeGateway implements OnGatewayInit{

  @WebSocketServer() server: Server;

  constructor(@Inject(ISocketServiceProvider) private socketService: ISocketService) {}

  afterInit(server: Server){
    this.socketService.setServer(server);
  }
}
