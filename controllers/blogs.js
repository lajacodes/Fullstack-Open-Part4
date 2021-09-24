const notesRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const { error } = require("../utils/logger");

notesRouter.get("/", async (request, response) => {
  const allBlogs = await Blog.find({});
  response.send(allBlogs);
});

notesRouter.post("/", async (request, response, next) => {
  const postBlog = request.body;

  const blog = new Blog({
    title: postBlog.title,
    author: postBlog.author,
    url: postBlog.url,
    likes: postBlog.likes,
  });

  const saveBlogs = await blog.save();
  response.json(saveBlogs);
});

// notesRouter.get("/", (req, res) => {
//   res.send("<h1>blog app display</h1>");
// });

notesRouter.delete("/:id", async (request, response, next) => {
  const deleteOne = request.params.id;
  const deleteId = await Blog.findByIdAndRemove(deleteOne);
  if (deleteId) {
    response.status(204).end();
  } else {
    response.status(409).send({ error: "id not found" });
  }
});

notesRouter.put("/:id", async (request, response, next) => {
  const updateBlog = request.body;

  const blog = {
    title: updateBlog.title,
    author: updateBlog.author,
    url: updateBlog.url,
    likes: updateBlog.likes,
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

notesRouter.get("/:id", async (request, response, next) => {
  const getId = await Blog.findById(request.params.id);
  if (getId) {
    response.json(getId);
  } else {
    response.status(404).end();
  }
});

module.exports = notesRouter;
