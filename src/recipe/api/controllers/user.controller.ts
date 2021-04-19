import { Controller, Get, Inject, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';

@Controller('user')
export class UserController {

  constructor(@Inject(IUserServiceProvider) private userService: IUserService) {}

  @Get('salt')
  GetSalt(){
    return this.userService.generateSalt();
  }

  @Post('login')
  Login(@MessageBody() data: any){
    return this.userService.generateHash(data.password, data.salt);
  }

}
