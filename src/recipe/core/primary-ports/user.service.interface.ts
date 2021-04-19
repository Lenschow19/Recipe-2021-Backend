export const IUserServiceProvider = 'IRecipeServiceProvider'
export interface IUserService{

  generateSalt(): string
  generateHash(password: string, salt: string): string

}
