'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserService = void 0;
const firestore_1 = require('firebase/firestore');
const user_repository_1 = require('./user.repository');
class UserService extends user_repository_1.UserRepository {
  data;
  constructor(data) {
    super();
    this.data = data;
  }
  toJSON() {
    return {
      ...this.data,
      createdAt: this.data.createdAt || firestore_1.Timestamp.now(),
      updatedAt: firestore_1.Timestamp.now(),
    };
  }
  getFullName() {
    return `${this.data.firstName || ''} ${this.data.lastName || ''}`.trim();
  }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
