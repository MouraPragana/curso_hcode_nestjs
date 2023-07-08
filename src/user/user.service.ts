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
    const existsUser = await this.userRepository.exist({ where: { email } });

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

    const userSaved = await this.userRepository.save(userToCreate);
    return this.showById(userSaved.id);
  }

  async listAll() {
    return await this.userRepository.find();
  }

  async listOne(id: string) {
    await this.exists(id);
    return await this.userRepository.findOneBy({ id });
  }

  async update(
    id: string,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await this.userRepository.update(
      { id },
      {
        email,
        name,
        password: hashPassword,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
    );

    return this.showById(id);
  }

  async updatePartial(
    id: string,
    { email, name, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);

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

    await this.userRepository.update(
      { id },
      {
        email: data.email ?? undefined,
        name: data.name ?? undefined,
        password: data.password ?? undefined,
        birthAt: data.birthAt ?? undefined,
        role: data.role ?? undefined,
      },
    );

    return await this.showById(id);
  }

  async delete(id: string) {
    await this.exists(id);
    await this.userRepository.softDelete({ id });
    return true;
  }

  async exists(id: string) {
    const findUserById = await this.userRepository.exist({ where: { id } });

    if (!findUserById) {
      throw new NotFoundException('Usuário não existe !');
    }
  }

  async showById(id: string) {
    this.exists(id);
    return await this.userRepository.findOneBy({ id });
  }
}
