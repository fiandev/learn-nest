import { Injectable } from '@nestjs/common';
import { Timestamp } from 'firebase/firestore';
import { IUser, UserRole } from '@/models/user.model';
import { UserRepository } from './user.repository';

export class UserService extends UserRepository {
  constructor(public data: IUser) {
    super();
  }

  // Serialize for storage
  toJSON(): IUser {
    return {
      ...this.data,
      createdAt: this.data.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  }

  // Get full name
  getFullName(): string {
    return `${this.data.firstName || ''} ${this.data.lastName || ''}`.trim();
  }
}
