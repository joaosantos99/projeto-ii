import Users from '../database/models/Users';

/**
 * Service for the users routes.
 */
class UsersService {
  /**
   * Get all users.
   * @returns {Promise<Array<User>>} - The users.
   */
  static async getUsers() {
    const users = await Users.findAll();

    if (!users) {
      throw new Error({ statusCode: 404, message: 'No users found' });
    }

    return users;
  }
}

export default UsersService;
