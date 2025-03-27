'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
  UserRole['ADMIN'] = 'admin';
  UserRole['USER'] = 'user';
  UserRole['MODERATOR'] = 'moderator';
})(UserRole || (exports.UserRole = UserRole = {}));
class User {
  data;
  constructor(data) {
    this.data = data;
  }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map
