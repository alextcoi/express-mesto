const usersRouter = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

usersRouter.get("/", getUsers);

usersRouter.get("/:userId", getUser);

usersRouter.post("/", createUser);

usersRouter.patch("/me", updateProfile);

usersRouter.patch("/me/avatar", updateAvatar);

module.exports = usersRouter;
