import { Injectable } from '@nestjs/common';
import { IUserService } from '../primary-ports/user.service.interface';
import { AuthenticationHelper } from '../../../auth/authentication.helper';
import { LoginDto } from '../../api/dtos/login.dto';
import { User } from '../models/user';
import { log } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/data-source/postgres/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginResponseDto } from '../../api/dtos/login.response.dto';
import { RecipeGetDto } from '../../api/dtos/recipe.get.dto';
import { Recipe } from '../models/recipe';
import { RecipeEntity } from '../../infrastructure/data-source/postgres/entities/recipe.entity';

@Injectable()
export class UserService implements IUserService{

  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>, private authenticationHelper: AuthenticationHelper) {}

  generateSalt(): string {
    return this.authenticationHelper.generateSalt();
  }

  generateHash(password: string, salt: string): string {
    return this.authenticationHelper.generateHash(password, salt);
  }

  async login(loginDTO: LoginDto): Promise<User>{

    if(loginDTO == null || loginDTO.username == null || loginDTO.password == null){
      throw new Error('Username or Password is non-existing');
    }

    let foundUser: User = await this.userRepository.findOne({where: `"username" ILIKE '${loginDTO.username}'`})

    if(foundUser == null){
      throw new Error('No user registered with such a name');
    }

    this.authenticationHelper.validateLogin(foundUser, loginDTO);
    return foundUser;
  }

  createUser(loginDTO: LoginDto): User {

    if(loginDTO.username == null || loginDTO.username.length < 8 || loginDTO.username.length > 24){
      throw new Error('Username must be between 8-24 characters');
    }
    if(loginDTO.password == null || loginDTO.password.length < 8){
      throw new Error('Password must be minimum 8 characters long');
    }

    let salt: string = this.authenticationHelper.generateSalt();
    let hashedPassword: string = this.authenticationHelper.generateHash(loginDTO.password, salt);
    return {ID: 0, username: loginDTO.username, password: hashedPassword, salt: salt};

  }

  async addUser(user: User): Promise<User> {
    const existingUsers = await this.userRepository.count({where: `"username" ILIKE '${user.username}'`});

    if(existingUsers > 0){
      throw new Error('User with the same name already exists');
    }

    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  generateJWTToken(user: User): string {

    if(user == null){
      throw new Error('User cant be null');
    }
    if(user.password == null || user.salt == null)
    {
      throw new Error('User is missing a password or salt');
    }

    return this.authenticationHelper.generateJWTToken(user);
  }

  verifyJWTToken(token: string): LoginResponseDto{
    try{return this.authenticationHelper.validateJWTToken(token);}
    catch (e) {throw new Error('Invalid signature');}
  }

  async getUserById(userID: number): Promise<User> {

    if(userID <= 0)
    {
      throw new Error('Incorrect user ID entered');
    }

    const foundUser = await this.userRepository.findOne({where: {ID: userID}});
    if(foundUser == null || foundUser == undefined){throw new Error('User with such ID does not exist')}
    return foundUser;
  }

  async updatePassword(userID: number, password: string, oldPassword: string): Promise<boolean> {

    if(userID <= 0)
    {
      throw new Error('Incorrect user ID entered');
    }

    if(password == null || password.length < 8){
      throw new Error('Password must be minimum 8 characters long');
    }

    const user: User = await this.getUserById(userID);

    this.authenticationHelper.validateLogin(user, {username: user.username, password: oldPassword})
    user.salt = this.authenticationHelper.generateSalt();
    user.password = this.authenticationHelper.generateHash(password, user.salt);

    const updatedUser = await this.userRepository.save(user);

    if(updatedUser == null || updatedUser == undefined){throw new Error('Error updating user password')}
    return true;
  }

}
