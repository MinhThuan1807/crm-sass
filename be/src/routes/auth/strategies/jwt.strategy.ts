
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import envConfig from 'src/common/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envConfig.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: { userId: number; role: string; tenantId: number }) {
    console.log('JWT Payload:', payload) 
    return { userId: payload.userId, role: payload.role, tenantId: payload.tenantId };
  }
}
