import { UserService } from '../user/user.service';
import { userEntityList } from './user-entity-list.mock';

export const userServiceMock = {
  provide: UserService,
  useValue: {
    exists: jest.fn(),
    listOne: jest.fn().mockResolvedValue(userEntityList[0]),
    listAll: jest.fn().mockResolvedValue(userEntityList),
    create: jest.fn().mockResolvedValue(userEntityList[0]),
    update: jest.fn().mockResolvedValue(userEntityList[0]),
    updatePartial: jest.fn().mockResolvedValue(userEntityList[0]),
    delete: jest.fn().mockReturnValue(true),
  },
};
