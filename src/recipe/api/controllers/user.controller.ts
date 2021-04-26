import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { LoginDto } from '../dtos/login.dto';
import { User } from '../../core/models/user';
import { LoginResponseDto } from '../dtos/login.response.dto';

@Controller('user')
export class UserController {

  constructor(@Inject(IUserServiceProvider) private userService: IUserService) {}

  @Post('login')
  async login(@MessageBody() loginDto: LoginDto){

    try
    {
      const foundUser: User = await this.userService.login(loginDto);

      if(foundUser == null ||foundUser == undefined){
        throw new HttpException('Error loading user', HttpStatus.BAD_REQUEST);
      }

      const tokenString = this.userService.generateJWTToken(foundUser);
      const responseDTO: LoginResponseDto = {token: tokenString};
      return responseDTO;
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

      if(addedUser == null || addedUser == undefined){
        throw new HttpException('Error saving user to database', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return addedUser;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verifyToken')
  verifyToken(@MessageBody() loginResponseDTO: LoginResponseDto){
    try{return this.userService.verifyJWTToken(loginResponseDTO.token);}
    catch (e) {throw new HttpException(e.message, HttpStatus.NOT_FOUND);}
  }

}
