import { Module } from '@nestjs/common';
import { AuthenticationHelper } from '../recipe/infrastructure/security/authentication.helper';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthenticationHelper, PassportModule, JwtStrategy],
  exports: [AuthenticationHelper, JwtStrategy],
  imports: [PassportModule, JwtModule.register({signOptions: {expiresIn: '60d'}})]
})
export class AuthModule {}
