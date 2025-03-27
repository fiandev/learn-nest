'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserRepository = void 0;
const firestore_1 = require('firebase/firestore');
const user_model_1 = require('../models/user.model');
const firebase_1 = require('../database/firebase');
class UserRepository {
  collectionRef;
  firestore;
  constructor() {
    this.firestore = firebase_1.firestore;
    this.collectionRef = (0, firestore_1.collection)(this.firestore, 'users');
  }
  validate(data) {
    const errors = [];
    if (!data.email) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Invalid email format');
    }
    if (!data.username) {
      errors.push('Username is required');
    } else if (data.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    if (!data.role) {
      data.role = user_model_1.UserRole.USER;
    }
    if (data.isActive === undefined) {
      data.isActive = true;
    }
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    return {
      ...data,
      createdAt: data.createdAt || firestore_1.Timestamp.now(),
      updatedAt: firestore_1.Timestamp.now(),
    };
  }
  async create(data) {
    const validatedData = this.validate(data);
    try {
      const docRef = await (0, firestore_1.addDoc)(
        this.collectionRef,
        validatedData,
      );
      return {
        ...validatedData,
        id: docRef.id,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async findById(id) {
    try {
      const docRef = (0, firestore_1.doc)(this.collectionRef, id);
      const snapshot = await (0, firestore_1.getDoc)(docRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }
  async findByEmail(email) {
    try {
      const q = (0, firestore_1.query)(
        this.collectionRef,
        (0, firestore_1.where)('email', '==', email),
      );
      const snapshot = await (0, firestore_1.getDocs)(q);
      if (snapshot.empty) return null;
      const userData = snapshot.docs[0];
      return {
        id: userData.id,
        ...userData.data(),
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
  async update(id, data) {
    try {
      const docRef = (0, firestore_1.doc)(this.collectionRef, id);
      const validatedData = this.validate({
        ...data,
        updatedAt: firestore_1.Timestamp.now(),
      });
      await (0, firestore_1.updateDoc)(docRef, validatedData);
      return { id, ...validatedData };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  async delete(id) {
    try {
      const docRef = (0, firestore_1.doc)(this.collectionRef, id);
      await (0, firestore_1.deleteDoc)(docRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  async list(filters = {}, options = {}) {
    try {
      let q = (0, firestore_1.query)(this.collectionRef);
      if (filters.role) {
        q = (0, firestore_1.query)(
          q,
          (0, firestore_1.where)('role', '==', filters.role),
        );
      }
      if (filters.isActive !== undefined) {
        q = (0, firestore_1.query)(
          q,
          (0, firestore_1.where)('isActive', '==', filters.isActive),
        );
      }
      if (options.orderBy) {
        q = (0, firestore_1.query)(
          q,
          (0, firestore_1.orderBy)(
            options.orderBy,
            options.ascending ? 'asc' : 'desc',
          ),
        );
      }
      if (options.limit) {
        q = (0, firestore_1.query)(q, (0, firestore_1.limit)(options.limit));
      }
      const snapshot = await (0, firestore_1.getDocs)(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map
