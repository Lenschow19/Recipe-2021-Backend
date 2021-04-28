import { LoginDto } from '../../api/dtos/login.dto';
import { User } from '../models/user';

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  generateSalt(): string
  generateHash(password: string, salt: string): string

  login(username: string, password: string): Promise<User>
  createUser(username: string, password: string): User
  addUser(user: User): Promise<User>

  generateJWTToken(user: User): string
  verifyJWTToken(token: string): string
  getUserById(userID: number): Promise<User>
  updatePassword(ID: number, password: string, oldPassword: string): Promise<boolean>
}
