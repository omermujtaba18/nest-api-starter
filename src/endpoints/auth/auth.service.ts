import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByFilter({ email });
    if (user) {
      if (user.googleId) {
        throw new BadRequestException(
          'Account is configured with google identity',
        );
      }

      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        return user;
      }
    }

    return null;
  }

  async login(user: UserDocument) {
    const payload = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup({ email, password }: { email: string; password: string }) {
    let user = await this.usersService.findOneByFilter({ email: email });

    if (user) {
      throw new BadRequestException(
        'Account with the provided email already exists',
      );
    }

    user = await this.usersService.create({ email, password });

    const payload = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
