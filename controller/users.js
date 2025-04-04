const User = require("../models/User");

const getUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getUserByCin = async (cin) => {
  return await User.findOne({ cin });
};

const addUser = async (user) => {
  const newUser = new User(user);
  await newUser.save();
  return newUser;
};

const updateUser = async (user) => {
  return await User.findByIdAndUpdate(user._id, user, { new: true });
};

const addVehiculeToUser = async (userId, vehicule) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Utilisateur non trouvé.");
  }

  user.vehicules.push(vehicule);
  await user.save();
  return user;
};

module.exports = {
  getUsers,
  getUserById,
  getUserByCin,
  addUser,
  updateUser,
  addVehiculeToUser,
};
