import { LoginDto } from '../../api/dtos/login.dto';
import { User } from '../models/user';

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  generateSalt(): string
  generateHash(password: string, salt: string): string

  login(loginDTO: LoginDto): Promise<User>
  createUser(loginDTO: LoginDto): User
  addUser(user: User): Promise<User>

  validateUser(ID: number): Promise<User>

}
