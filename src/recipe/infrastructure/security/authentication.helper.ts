import { Hmac } from 'crypto';
import { LoginDto } from '../../api/dtos/login.dto';
import { User } from '../../core/models/user';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

const crypto = require('crypto');
const saltLength = 16


@Injectable()
export class AuthenticationHelper {

  secretKey = crypto.randomBytes(saltLength).toString('hex').slice(0, saltLength);

  constructor(private jwtService: JwtService) {}

  generateHash(password: string, salt: string): string{
    let hash: Hmac = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return value;
  }

  generateSalt(): string{
    return crypto.randomBytes(saltLength).toString('hex').slice(0, saltLength);
  }

  validateLogin(userToValidate: User, loginDTO: LoginDto): void{

    let hashedPassword: string = this.generateHash(loginDTO.password, userToValidate.salt);
    let storedPassword: string = userToValidate.password;

    if(storedPassword !== hashedPassword){
      throw new Error('Entered password is incorrect');
    }
  }

  generateJWTToken(user: User): string{
    const payload = {ID: user.ID, username: user.username};
    const options: JwtSignOptions = {secret: this.secretKey, algorithm: 'HS256'}
    return this.jwtService.sign(payload, options);
  }

}
