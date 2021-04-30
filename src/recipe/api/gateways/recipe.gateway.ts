import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ISocketService, ISocketServiceProvider } from '../../core/primary-ports/socket.service.interface';

@WebSocketGateway()
export class RecipeGateway implements OnGatewayInit{

  @WebSocketServer() server: Server;

  constructor(@Inject(ISocketServiceProvider) private socketService: ISocketService) {}

  afterInit(server: Server){
    this.socketService.setServer(server);
  }

  @SubscribeMessage('joinPersonalRoom')
  async handleUpdateEvent(@MessageBody() userID: number, @ConnectedSocket() client: Socket) {
    if(userID != null)
    {
      client.leaveAll();
      client.join(`${userID}`);
    }
  }
}
