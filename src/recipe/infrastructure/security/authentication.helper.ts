import { Hmac } from 'crypto';

const crypto = require('crypto');
const saltLength = 16


export class AuthenticationHelper {

  generateHash(password: string, salt: string): string{
    let hash: Hmac = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return value;
  }

  generateSalt(): string{
    return crypto.randomBytes(saltLength).toString('hex').slice(0, saltLength);
  }

  //Some method comparing hashed password of typed password and saved salt with stored user password

}
