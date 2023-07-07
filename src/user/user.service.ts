import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create({ email, name, password, birthAt, role }: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const userToCreate = this.userRepository.create({
      email,
      name,
      password: hashPassword,
      birthAt: new Date(birthAt),
      role,
    });

    return await this.userRepository.save(userToCreate);
  }

  async listAll() {
    return await this.userRepository.find();
  }

  async listOne(id: string) {
    await this.existsUser(id);
    return await this.userRepository.findOneBy({ id });
  }

  async update(
    id: string,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.existsUser(id);

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    return await this.userRepository.update(
      { id },
      {
        email,
        name,
        password: hashPassword,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
    );
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

    return await this.userRepository.update(
      { id },
      {
        email: data.email,
        name: data.name,
        password: data.password,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
    );
  }

  async delete(id: string) {
    await this.existsUser(id);
    return await this.userRepository.softDelete({ id });
  }

  async existsUser(id: string) {
    const findUserById = await this.userRepository.findOneBy({ id });

    if (!findUserById) {
      throw new NotFoundException('Usuário não existe !');
    }
  }
}
