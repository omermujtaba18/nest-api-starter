import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly email: string;
}

export class CreateUserLocalDto extends CreateUserDto {
  @IsString()
  readonly password: string;
}

export class CreateUserGoogleDto extends CreateUserDto {
  @IsString()
  readonly googleId: string;
}
