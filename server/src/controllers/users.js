import UserSerializer from '../serializers/UserSerializer';
import UsersService from '../services/users';


/**
 * Controller for the users routes.
 */
class UsersController {

  /**
   * Get all users.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getUsers(req, res) {
    try {
      const users = await UsersService.getUsers();

      res.json(UserSerializer.serialize(users));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default UsersController;
