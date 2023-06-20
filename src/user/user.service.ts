import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password, birthAt }: CreateUserDTO) {
    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        birthAt: new Date(birthAt),
      },
    });
  }

  async listAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        birthAt: true,
      },
    });
  }

  async listOne(id: string) {
    await this.existsUser(id);

    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        birthAt: true,
      },
    });
  }

  async update(
    id: string,
    { email, name, password, birthAt }: UpdatePutUserDTO,
  ) {
    await this.existsUser(id);

    return await this.prisma.user.update({
      data: {
        email,
        name,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
      where: { id },
    });
  }

  async updatePartial(
    id: string,
    { email, name, password, birthAt }: UpdatePatchUserDTO,
  ) {
    await this.existsUser(id);

    const data = {} as {
      email?: string;
      name?: string;
      password?: string;
      birthAt?: Date;
    };

    email && (data.email = email);
    name && (data.name = name);
    password && (data.password = password);
    birthAt && (data.birthAt = new Date(birthAt));

    return await this.prisma.user.update({ data, where: { id } });
  }

  async delete(id: string) {
    await this.existsUser(id);

    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async existsUser(id: string) {
    const findUserById = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!findUserById) {
      throw new NotFoundException('Usuário não existe !');
    }
  }
}
