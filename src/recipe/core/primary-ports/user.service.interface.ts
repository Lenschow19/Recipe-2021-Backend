import { LoginDto } from '../../api/dtos/login.dto';
import { User } from '../models/user';
import { LoginResponseDto } from '../../api/dtos/login.response.dto';

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  generateSalt(): string
  generateHash(password: string, salt: string): string

  login(loginDTO: LoginDto): Promise<User>
  createUser(loginDTO: LoginDto): User
  addUser(user: User): Promise<User>

  generateJWTToken(user: User): string
  verifyJWTToken(token: string): LoginResponseDto
  getUserById(userID: number): Promise<User>
  updatePassword(ID: number, password: string, oldPassword: string): Promise<boolean>
}
