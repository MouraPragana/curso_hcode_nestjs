import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserService } from './user.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { ParamId } from '../decorators/param-id.decorator';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() { email, name, password, birthAt, role }: CreateUserDTO,
  ) {
    return await this.userService.create({
      email,
      name,
      password,
      birthAt,
      role,
    });
  }

  @Get()
  async read() {
    return await this.userService.listAll();
  }

  @Get(':id')
  async readOne(@ParamId(new ParseUUIDPipe()) id: string) {
    return await this.userService.listOne(id);
  }

  @Put(':id')
  async update(
    @Body() data: UpdatePutUserDTO,
    @ParamId(new ParseUUIDPipe()) id: string,
  ) {
    return await this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchUserDTO,
    @ParamId(new ParseUUIDPipe()) id: string,
  ) {
    return await this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId(new ParseUUIDPipe()) id: string) {
    return await this.userService.delete(id);
  }
}
