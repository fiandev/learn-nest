import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  CollectionReference,
  Timestamp,
  DocumentData,
  Firestore,
} from 'firebase/firestore';
import { IUser, UserRole } from '@/models/user.model';
import { firestore } from '@/database/firebase';

export class UserRepository {
  private collectionRef: CollectionReference;
  private firestore: Firestore;

  constructor() {
    this.firestore = firestore;
    this.collectionRef = collection(this.firestore, 'users');
  }

  validate(data: Partial<IUser>): IUser {
    const errors: string[] = [];

    // Email validation
    if (!data.email) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Invalid email format');
    }

    // Username validation
    if (!data.username) {
      errors.push('Username is required');
    } else if (data.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    // Role validation
    if (!data.role) {
      data.role = UserRole.USER; // Default role
    }

    // Activation status
    if (data.isActive === undefined) {
      data.isActive = true; // Default to active
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    return {
      ...data,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as IUser;
  }

  // Create a new user
  async create(data: Partial<IUser>): Promise<IUser> {
    const validatedData = this.validate(data);

    try {
      const docRef = await addDoc(this.collectionRef, validatedData);
      return {
        ...validatedData,
        id: docRef.id,
      } as IUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(id: string): Promise<IUser | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const snapshot = await getDoc(docRef);

      return snapshot.exists()
        ? ({ id: snapshot.id, ...snapshot.data() } as IUser)
        : null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  // Find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const q = query(this.collectionRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const userData = snapshot.docs[0];
      return {
        id: userData.id,
        ...userData.data(),
      } as IUser;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Update user
  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    try {
      const docRef = doc(this.collectionRef, id);
      const validatedData = this.validate({
        ...data,
        updatedAt: Timestamp.now(),
      });

      await updateDoc(docRef, validatedData as DocumentData);
      return { id, ...validatedData } as IUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // List users with filtering and pagination
  async list(
    filters: {
      role?: UserRole;
      isActive?: boolean;
    } = {},
    options: {
      limit?: number;
      orderBy?: keyof IUser;
      ascending?: boolean;
    } = {},
  ): Promise<IUser[]> {
    try {
      let q = query(this.collectionRef);

      // Apply role filter
      if (filters.role) {
        q = query(q, where('role', '==', filters.role));
      }

      // Apply active status filter
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }

      // Apply ordering
      if (options.orderBy) {
        q = query(
          q,
          orderBy(
            options.orderBy as string,
            options.ascending ? 'asc' : 'desc',
          ),
        );
      }

      // Apply limit
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as IUser,
      );
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }
}
