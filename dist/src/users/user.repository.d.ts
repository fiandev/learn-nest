import { IUser, UserRole } from '@/models/user.model';
export declare class UserRepository {
  private collectionRef;
  private firestore;
  constructor();
  validate(data: Partial<IUser>): IUser;
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, data: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<void>;
  list(
    filters?: {
      role?: UserRole;
      isActive?: boolean;
    },
    options?: {
      limit?: number;
      orderBy?: keyof IUser;
      ascending?: boolean;
    },
  ): Promise<IUser[]>;
}
