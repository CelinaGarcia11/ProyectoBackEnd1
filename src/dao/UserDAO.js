import User from "../models/User.js";

export default class UserDAO {
  getAll = () => User.find();

  getBy = (filter) => User.findOne(filter);

  create = (data) => User.create(data);

  update = (id, data) => User.findByIdAndUpdate(id, data);

  delete = (id) => User.findByIdAndDelete(id);
}