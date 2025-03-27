import { Timestamp } from 'firebase/firestore';
export declare enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
export interface IUser {
  id?: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profileImageUrl?: string;
  isActive: boolean;
  lastLogin?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
export declare class User {
  data: IUser;
  constructor(data: IUser);
}
