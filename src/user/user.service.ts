import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create({ email, name, password, birthAt, role }: CreateUserDTO) {
    const existsUser = await this.userRepository.findOneBy({ email });

    if (existsUser) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const userToCreate = this.userRepository.create({
      email,
      name,
      password: hashPassword,
      birthAt,
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
      birthAt?: string;
      role?: string;
    };

    email && (data.email = email);
    name && (data.name = name);

    if (password) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      data.password = hashPassword;
    }

    birthAt && (data.birthAt = birthAt);
    role && (data.role = role);

    return await this.userRepository.update(
      { id },
      {
        email: data.email ?? undefined,
        name: data.name ?? undefined,
        password: data.password ?? undefined,
        birthAt: data.birthAt ?? undefined,
        role: data.role ?? undefined,
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
