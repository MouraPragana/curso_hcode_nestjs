import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    name: 'Mateus',
    email: 'mateus@gmail.com',
    birthAt: new Date('1990-01-01'),
    id: 'e64e05a6-9b43-40cc-b61f-1210fbdfb0b6',
    password: '$2b$10$nvZLWdIUHZuJCklWklR3E.J0lqiV/hyumxDVNS8eweaEM8vFyUOuC',
    role: Role.User,
    createdAt: new Date('2023-07-08 19:04:39.991677'),
    updatedAt: new Date('2023-07-08 19:04:39.991677'),
    deletedAt: null,
  },
];
