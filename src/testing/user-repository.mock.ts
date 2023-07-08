import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';

export const userRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  useValue: {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  },
};
