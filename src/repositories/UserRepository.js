export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = () => this.dao.getAll();

  getUserBy = (filter) => this.dao.getBy(filter);

  createUser = (user) => this.dao.create(user);

  updateUser = (id, user) => this.dao.update(id, user);

  deleteUser = (id) => this.dao.delete(id);
}