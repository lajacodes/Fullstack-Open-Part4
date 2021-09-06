const notesRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const { error } = require("../utils/logger");

notesRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    return response.send(blogs);
  });
});

notesRouter.post("/", (request, response, next) => {
  const postBlog = request.body;

  const blog = new Blog({
    title: postBlog.title,
    author: postBlog.author,
    url: postBlog.url,
    likes: postBlog.likes,
  });

  blog
    .save()
    .then((saveBlog) => {
      return response.status(201).json(saveBlog);
    })
    .catch((error) => error(next));
});

// notesRouter.get("/", (req, res) => {
//   res.send("<h1>blog app display</h1>");
// });

notesRouter.delete("/:id", (request, response, next) => {
  const deleteOne = request.params.id;
  Blog.findByIdAndRemove(deleteOne)
    .then((blogs) => {
      if (blogs) response.status(204).end();
      else response.status(409).send({ error: "id not found" });
    })
    .catch((error) => error(next));
});

notesRouter.put("/:id", (request, response, next) => {
  const updateBlog = request.body;

  const blog = {
    title: updateBlog.title,
    author: updateBlog.author,
    url: updateBlog.url,
    likes: updateBlog.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

notesRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
