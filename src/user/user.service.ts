import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password, birthAt, role }: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    return await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
        birthAt: new Date(birthAt),
        role,
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
        role: true,
      },
    });
  }

  async update(
    id: string,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.existsUser(id);

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    return await this.prisma.user.update({
      data: {
        email,
        name,
        password: hashPassword,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
      where: { id },
    });
  }

  async updatePartial(
    id: string,
    { email, name, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    await this.existsUser(id);

    const data = {} as {
      email?: string;
      name?: string;
      password?: string;
      birthAt?: Date;
      role?: number;
    };

    email && (data.email = email);
    name && (data.name = name);

    if (password) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      data.password = hashPassword;
    }

    birthAt && (data.birthAt = new Date(birthAt));
    role && (data.role = role);

    console.log(data);

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
