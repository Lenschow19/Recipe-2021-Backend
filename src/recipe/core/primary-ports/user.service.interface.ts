import { User } from '../models/user';

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  createUser(username: string, password: string): User
  addUser(user: User): Promise<User>

  generateSalt(): string
  generateHash(password: string, salt: string): string
  generateJWTToken(user: User): string

  getUserById(userID: number): Promise<User>
  updatePassword(ID: number, password: string, oldPassword: string): Promise<boolean>

  login(username: string, password: string): Promise<User>
  verifyJWTToken(token: string): string
}
