import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  async getUsers(@Res() res: Response): Promise<Response> {
    let users = await this.userService.list();
    return res.json(users);
  }
}
