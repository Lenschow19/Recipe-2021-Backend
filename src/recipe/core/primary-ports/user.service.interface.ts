import { LoginDto } from '../../api/dtos/login.dto';
import { User } from '../models/user';

export const IUserServiceProvider = 'IRecipeServiceProvider'
export interface IUserService{

  generateSalt(): string
  generateHash(password: string, salt: string): string

  login(loginDTO: LoginDto): Promise<User>
  createUser(loginDTO: LoginDto): User
  addUser(user: User): Promise<User>

}
