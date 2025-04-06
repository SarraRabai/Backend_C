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

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({//find the users that they haven't ni id ni password 
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByCin,
  addUser,
  updateUser,
  addVehiculeToUser,
  getUsersForSidebar,
};
