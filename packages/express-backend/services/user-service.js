import mongoose from "mongoose";
import User from "../models/user.js";

const toUserResponse = (user) => {
  return {
    _id: user._id.toString(),
    name: user.name,
    job: user.job,
  };
};

export const findUsers = ({ name, job } = {}) => {
  const query = {};

  if (name !== undefined) {
    query.name = name;
  }

  if (job !== undefined) {
    query.job = job;
  }

  return User.find(query).then((users) => users.map(toUserResponse));
};

export const findUserById = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Promise.resolve(undefined);
  }

  return User.findById(id).then((user) => {
    if (user === null) {
      return undefined;
    }

    return toUserResponse(user);
  });
};

export const addUser = (user) => {
  const userToAdd = {
    name: user.name,
    job: user.job,
  };

  return User.create(userToAdd).then(toUserResponse);
};

export const deleteUserById = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Promise.resolve(undefined);
  }

  return User.findByIdAndDelete(id).then((deletedUser) => {
    if (deletedUser === null) {
      return undefined;
    }

    return toUserResponse(deletedUser);
  });
};
