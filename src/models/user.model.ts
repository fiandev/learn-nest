// user.model.ts
import { Timestamp } from 'firebase/firestore';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

/**
 * User Interface
 */
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

/**
 * User Model Class
 */
export class User {
  constructor(public data: IUser) {}
}
