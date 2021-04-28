import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post, Put, Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { LoginDto } from '../dtos/login.dto';
import { User } from '../../core/models/user';
import { LoginResponseDto } from '../dtos/login.response.dto';
import { Filter } from '../../core/models/filter';
import { UserGetDto } from '../dtos/user.get.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserService } from '../../core/services/user.service';

@Controller('user')
export class UserController {

  constructor(@Inject(IUserServiceProvider) private userService: IUserService) {}

  @Post('login')
  async login(@MessageBody() loginDto: LoginDto){

    try
    {
      const foundUser: User = await this.userService.login(loginDto.username, loginDto.password);

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
      let createdUser: User = this.userService.createUser(loginDto.username, loginDto.password);
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

  @UseGuards(JwtAuthGuard)
  @Get('getByID')
  async getByID(@Query() userGetDTO: UserGetDto){
    try
    {
      return await this.userService.getUserById(userGetDTO.userID);
    }
    catch (e) {throw new HttpException('Error loading user with ID: ' + userGetDTO.userID, HttpStatus.NOT_FOUND);}
  }

  @UseGuards(JwtAuthGuard)
  @Put('updatePassword')
  async updatePassword(@MessageBody() userUpdateDTO: UserUpdateDto){
    try
    {
      const updated: boolean = await this.userService.updatePassword(userUpdateDTO.userID, userUpdateDTO.password, userUpdateDTO.oldPassword);
      if(!updated){throw new Error('Error updating user password');}
      return updated;
    }
    catch (e) {throw new HttpException(e.message, HttpStatus.BAD_REQUEST);}
  }

}
