import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { userEntityList } from './user-entity-list.mock';

export const userRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  useValue: {
    exist: jest.fn().mockResolvedValue(true),
    findOneBy: jest.fn().mockResolvedValue(userEntityList[0]),
    create: jest.fn().mockReturnValue(userEntityList[0]),
    save: jest.fn().mockResolvedValue(userEntityList[0]),
    find: jest.fn().mockResolvedValue(userEntityList),
    update: jest.fn(),
    softDelete: jest.fn(),
  },
};
