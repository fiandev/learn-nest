import { Timestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { UserRepository } from '@/users/user.repository';
import { User, UserRole, IUser } from '@/models/user.model';
import { UserService } from '@/users/user.service';

// Mock Firebase dependencies
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe('UserRepository - Create User', () => {
  let userRepository: UserRepository;
  let mockFirestore: any;

  // Setup before each test
  beforeEach(() => {
    // Create a mock Firestore instance
    mockFirestore = {
      email: 'john.doe@example.com',
      username: 'john',
      role: UserRole.USER,
      isActive: true,
    };

    // Create UserRepository with mock Firestore
    userRepository = new UserService(mockFirestore);
  });

  // Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Positive test case: Valid user creation
  describe('Positive Scenarios', () => {
    test('should successfully create a valid user', async () => {
      // Arrange
      const userData: Partial<IUser> = {
        email: 'john.doe@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
      };

      // Mock addDoc to return a document reference
      const mockDocRef = {
        id: 'test-user-id',
      };
      (require('firebase/firestore').addDoc as jest.Mock).mockResolvedValue(
        mockDocRef,
      );

      // Act
      const createdUser = await userRepository.create(userData);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBe('test-user-id');
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.username).toBe(userData.username);
      expect(createdUser.role).toBe(UserRole.USER);
      expect(createdUser.isActive).toBe(true); // Default value
      expect(createdUser.createdAt).toBeDefined();
      expect(createdUser.updatedAt).toBeDefined();
    });
  });

  // Negative test cases
  describe('Negative Scenarios', () => {
    // Invalid email
    test('should throw error for invalid email', async () => {
      // Arrange
      const invalidUserData: Partial<IUser> = {
        email: 'invalid-email',
        username: 'johndoe',
        role: UserRole.USER,
      };

      // Act & Assert
      await expect(userRepository.create(invalidUserData)).rejects.toThrow(
        'Invalid email format',
      );
    });

    // Short username
    test('should throw error for short username', async () => {
      // Arrange
      const invalidUserData: Partial<IUser> = {
        email: 'john.doe@example.com',
        username: 'jo',
        role: UserRole.USER,
      };

      // Act & Assert
      await expect(userRepository.create(invalidUserData)).rejects.toThrow(
        'Username must be at least 3 characters',
      );
    });

    // Missing required fields
    test('should throw error for missing required fields', async () => {
      // Arrange
      const invalidUserData: Partial<IUser> = {};

      // Act & Assert
      await expect(userRepository.create(invalidUserData)).rejects.toThrow(
        'Email is required',
      );
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    // Default role assignment
    test('should assign default role if not specified', async () => {
      // Arrange
      const userData: Partial<IUser> = {
        email: 'john.doe@example.com',
        username: 'johndoe',
      };

      // Mock addDoc to return a document reference
      const mockDocRef = {
        id: 'test-user-id',
      };
      (require('firebase/firestore').addDoc as jest.Mock).mockResolvedValue(
        mockDocRef,
      );

      // Act
      const createdUser = await userRepository.create(userData);

      // Assert
      expect(createdUser.role).toBe(UserRole.USER);
    });

    // Different roles
    test('should create user with different roles', async () => {
      // Arrange
      const adminUserData: Partial<IUser> = {
        email: 'admin@example.com',
        username: 'adminuser',
        role: UserRole.ADMIN,
      };

      // Mock addDoc to return a document reference
      const mockDocRef = {
        id: 'admin-user-id',
      };
      (require('firebase/firestore').addDoc as jest.Mock).mockResolvedValue(
        mockDocRef,
      );

      // Act
      const createdAdminUser = await userRepository.create(adminUserData);

      // Assert
      expect(createdAdminUser.role).toBe(UserRole.ADMIN);
    });
  });

  // Integration-like tests
  describe('Repository Integration Checks', () => {
    test('should call addDoc with correct parameters', async () => {
      // Arrange
      const userData: Partial<IUser> = {
        email: 'john.doe@example.com',
        username: 'johndoe',
        role: UserRole.USER,
      };

      // Mock addDoc
      const mockAddDoc = require('firebase/firestore').addDoc as jest.Mock;
      mockAddDoc.mockResolvedValue({ id: 'test-user-id' });

      // Act
      await userRepository.create(userData);

      // Assert
      expect(mockAddDoc).toHaveBeenCalledTimes(1);

      // // Check if the first argument is the collection reference
      // expect(mockAddDoc.mock.calls[0][0]).toBeDefined();

      // Check if the second argument contains the validated user data
      const passedUserData = mockAddDoc.mock.calls[0][1];
      expect(passedUserData.email).toBe(userData.email);
      expect(passedUserData.username).toBe(userData.username);
      expect(passedUserData.role).toBe(UserRole.USER);
    });
  });
});
