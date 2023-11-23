const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  deleteUser,
  addUser,
  updateUser,
  loginUser,
  registerUser,
  userCount,
} = require("../controllers/usersControllers");

router.get("/", getUsers);

router.get("/:id", getUser);

router.delete("/:id", deleteUser);

router.post("/", addUser);

router.put("/:id", updateUser);

router.post('/login', loginUser);

router.post('/register', registerUser)

router.get("/get/count", userCount);

module.exports = router;
