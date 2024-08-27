import { Controller, Request as Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor() {}

  @Get('/')
  getUser(@Req() req: Request) {
    return req.user;
  }
}
