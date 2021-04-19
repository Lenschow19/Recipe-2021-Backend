import { Injectable } from '@nestjs/common';
import { IUserService } from '../primary-ports/user.service.interface';
import { AuthenticationHelper } from '../../infrastructure/security/authentication.helper';

@Injectable()
export class UserService implements IUserService{

  constructor(private authenticationHelper: AuthenticationHelper) {}

  generateSalt(): string {
    return this.authenticationHelper.generateSalt();
  }

  generateHash(password: string, salt: string): string {
    return this.authenticationHelper.generateHash(password, salt);
  }

}
