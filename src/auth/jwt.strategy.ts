import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationHelper } from '../recipe/infrastructure/security/authentication.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationHelper: AuthenticationHelper) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authenticationHelper.secretKey,
    });
  }

  async validate(payload: any) {
    return { userId: payload.ID, username: payload.username };
  }

}
