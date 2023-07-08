import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    name: 'Mateus de Moura',
    email: 'mateuspragana@gmail.com',
    birthAt: new Date('1990-05-29'),
    id: '4e11016e-2939-4bec-8cee-67f24c75844e',
    password: '$2b$10$tSl4RnwEMOpHN0K7YfPiI.VHz7tipl/2GaN4ZaSyh2WXE5pXtikcG',
    role: Role.Admin,
    createdAt: new Date('2023-07-07 23:46:59.776929'),
    updatedAt: new Date('2023-07-07 23:48:02.023202'),
    deletedAt: null,
  },
];
