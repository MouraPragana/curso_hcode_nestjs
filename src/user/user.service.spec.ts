import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from '../testing/create-user-dto.mock';
import { updatePutUserDto } from '../testing/update-put-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { updatePatchUserDto } from '../testing/update-patch-user-dto.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  test('Validar a definição', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    test('method create', async () => {
      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);
      const result = await userService.create(createUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('List', () => {
    test('method list all', async () => {
      const result = await userService.listAll();
      expect(result).toEqual(userEntityList);
    });

    test('method list one', async () => {
      const result = await userService.listOne(
        '4e11016e-2939-4bec-8cee-67f24c75845e',
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('method update', async () => {
      const result = await userService.update(
        '4e11016e-2939-4bec-8cee-67f24c75845e',
        updatePutUserDto,
      );
      expect(result).toEqual(userEntityList[0]);
    });
    test('method update partial', async () => {
      const result = await userService.updatePartial(
        '4e11016e-2939-4bec-8cee-67f24c75841e',
        updatePatchUserDto,
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('method delete', async () => {
      const result = await userService.delete(
        '4e11016e-2939-4bec-8cee-67f24c75841e',
      );
      expect(result).toEqual(true);
    });
  });
});
