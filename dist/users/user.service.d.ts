import { IUser } from '@/models/user.model';
import { UserRepository } from './user.repository';
export declare class UserService extends UserRepository {
  data: IUser;
  constructor(data: IUser);
  toJSON(): IUser;
  getFullName(): string;
}
