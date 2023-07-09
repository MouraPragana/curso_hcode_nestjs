import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { RoleGuard } from '../guards/role.guard';
import { UserService } from './user.service';
import { createUserDto } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { updatePutUserDto } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDto } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('Validar a definição', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Teste da aplicação dos Guardas neste controller', () => {
    test('Se os guards estão aplicados', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);
      expect(guards.length).toEqual(2);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
      expect(new guards[1]()).toBeInstanceOf(RoleGuard);
    });
  });

  describe('Create', () => {
    test('method create', async () => {
      const result = await userController.create(createUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    test('method read all', async () => {
      const result = await userController.read();
      expect(result).toEqual(userEntityList);
    });

    test('method read one', async () => {
      const result = await userController.readOne(
        'e64e05a6-9b43-40cc-b61f-1210fbdfb0b6',
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('method update', async () => {
      const result = await userController.update(
        updatePutUserDto,
        'e64e05a6-9b43-40cc-b61f-1210fbdfb0b6',
      );
      expect(result).toEqual(userEntityList[0]);
    });

    test('method update partial', async () => {
      const result = await userController.updatePartial(
        updatePatchUserDto,
        'e64e05a6-9b43-40cc-b61f-1210fbdfb0b6',
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('method delete', async () => {
      const result = await userController.delete(
        'e64e05a6-9b43-40cc-b61f-1210fbdfb0b6',
      );
      expect(result).toEqual(true);
    });
  });
});
