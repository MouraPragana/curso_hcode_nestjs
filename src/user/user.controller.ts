import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() { email, name, password, birthAt }: CreateUserDTO) {
    return await this.userService.create({ email, name, password, birthAt });
  }

  @Get()
  async read() {
    return await this.userService.listAll();
  }

  @Get(':id')
  async readOne(@Param('id') id: string) {
    return await this.userService.listOne(id);
  }

  @Put(':id')
  async update(@Body() data: UpdatePutUserDTO, @Param('id') id: string) {
    return await this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchUserDTO,
    @Param('id') id: string,
  ) {
    return await this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
