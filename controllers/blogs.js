const notesRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const { error } = require("../utils/logger");

notesRouter.get("/", async (request, response) => {
  const allBlogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(allBlogs);
});

notesRouter.post("/", async (request, response) => {
  const postBlog = request.body;

  const user = await User.findById(postBlog.userId);

  if (!postBlog.url || !postBlog.title) return response.status(400).end();
  if (!postBlog.likes) postBlog.likes === 0;

  const blog = new Blog({
    title: postBlog.title,
    author: postBlog.author,
    url: postBlog.url,
    likes: postBlog.likes,
    user: user._id,
  });

  const saveBlog = await blog.save();
  user.blogs = user.blogs.concat(saveBlog._id);
  await user.save();
  response.json(saveBlog);
});

notesRouter.delete("/:id", async (request, response) => {
  const deleteOne = request.params.id;
  await Blog.findByIdAndRemove(deleteOne);
  response.status(204).end();
});

notesRouter.put("/:id", async (request, response) => {
  const updateBlog = request.body;

  const blog = {
    title: updateBlog.title,
    author: updateBlog.author,
    url: updateBlog.url,
    likes: updateBlog.likes + 1,
  };

  const putIn = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  if (putIn) {
    response.json(putIn);
  } else {
    response.status(400).end();
  }
});

notesRouter.get("/:id", async (request, response) => {
  const getId = await Blog.findById(request.params.id);
  if (getId) {
    response.json(getId);
  } else {
    response.status(404).end();
  }
});

module.exports = notesRouter;
