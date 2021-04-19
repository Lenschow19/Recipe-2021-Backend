import { Controller, Get, HttpException, HttpStatus, Inject, Post, UnauthorizedException } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { LoginDto } from '../dtos/login.dto';
import { User } from '../../core/models/user';
import { STATUS_CODES } from 'http';

@Controller('user')
export class UserController {

  constructor(@Inject(IUserServiceProvider) private userService: IUserService) {}

  @Post('login')
  async login(@MessageBody() loginDto: LoginDto){

    try
    {
      let foundUser: User = await this.userService.login(loginDto);

      if(foundUser == null){
        throw new HttpException('Error loading user', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return foundUser;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

  }

  @Post('register')
  async register(@MessageBody() loginDto: LoginDto){

    try
    {
      let createdUser: User = this.userService.createUser(loginDto);
      let addedUser: User = await this.userService.addUser(createdUser);

      if(addedUser == null){
        throw new HttpException('Error saving user to database', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return addedUser;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

}