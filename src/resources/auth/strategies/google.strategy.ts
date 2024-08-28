import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import IConfiguration from '../../../confg/config.interface';
import { UsersService } from '../../../resources/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService<IConfiguration>,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get('googleClientID'),
      clientSecret: configService.get('googleClientSecret'),
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, emails } = profile;

    let user = await this.usersService.findOneByFilter({ googleId: id });

    if (user) {
      return done(null, user);
    } else {
      user = await this.usersService.findOneByFilter({
        email: emails[0].value,
      });

      if (user) {
        user.googleId = id;
        await user.save();
        return done(null, user);
      }

      user = await this.usersService.create({
        email: emails[0].value,
        googleId: id,
      });

      return done(null, user);
    }
  }
}
