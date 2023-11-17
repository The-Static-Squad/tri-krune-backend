const mongoose = require("mongoose");
const {User} = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json(userList);
}

const getUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(500).json({ message: "Invalid User Id." });
  }
  
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (!user) {
    return res
      .status(500)
      .json({ message: 'The user with the given ID was not found.' });
  }

  res.status(200).json(user);
}

const addUser = async (req, res) => {
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    // profilePicture: req.body.profilePicture,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    company: req.body.company,
    address: {
      street: req.body.street,
      streetNumber: req.body.streetNumber,
      city: req.body.city,
      zipCode: req.body.zipCode,
      country: req.body.country,
    },
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });

  user
    .save()
    .then(createdUser => {
      res.status(200).json(createdUser);
    })
    .catch(err => res.status(500).json(err));
}

const updateUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(500).json({ message: 'Invalid User Id.' });
  }

  const userExist = await User.findById(req.params.id);
  if (!userExist) {
    return res.status(404).json({ message: 'User not found.' });
  }

  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      passwordHash: newPassword,
      company: req.body.company,
      address: {
        street: req.body.street,
        streetNumber: req.body.streetNumber,
        city: req.body.city,
        zipCode: req.body.zipCode,
        country: req.body.country,
      },
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  )
    .then(updatedUser => res.status(200).json(updatedUser))
    .catch(err => res.status(500).json(err));
}

const deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: 'User has been deleted.' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
    })
    .catch(err => {
      return res.status(500).json({ success: false, error: err });
    });
}

const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ user: user.email, token: token });
  } else {
    res.status(400).json({ message: 'Password is wrong!' });
  }
}

const registerUser = async (req, res) => {
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    company: req.body.company,
    address: {
      street: req.body.street,
      streetNumber: req.body.streetNumber,
      city: req.body.city,
      zipCode: req.body.zipCode,
      country: req.body.country,
    },
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();

  if (!user) {
    return res.status(400).json({ message: 'User cannot be created' });
  }

  res.status(200).json(user);
}

const userCount = async (req, res) => {
  const userCount = await User.countDocuments({});

  if (!userCount) {
    return res.status(500).json({ success: false });
  }

  res.status(200).json({ userCount: userCount });
}

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
  userCount
};
