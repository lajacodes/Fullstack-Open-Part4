const bcrypt = require("bcrypt");
const { response } = require("express");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");
const { requestLogger } = require("../utils/middleware");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { title: 1, author: 1 });
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const finding = await User.findById(request.params.id);
  return response.send(finding);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.username || !body.password) return res.status(400).end();

  if (body.password.length < 3)
    return res.status(400).send({ error: "invlaid password" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  return response.json(savedUser);
});

usersRouter.delete("/:id", async (request, response) => {
  const del = request.params.id;
  await User.findByIdAndDelete(del);
  return response.status(204).send("users deleted");
});

module.exports = usersRouter;
