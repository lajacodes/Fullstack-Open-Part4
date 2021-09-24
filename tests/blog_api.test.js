const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBLogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBLogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blog")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("all blogs are returned", async () => {
  const response = await api.get("/api/blog");

  expect(response.body).toHaveLength(helper.initialBLogs.length);
}, 100000);

test("unique identify property of blog posts", async () => {
  const response = await api.get("/api/blog");

  expect(response.body[0].id).toBeDefined();
}, 100000);

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "money can buy hapiness",
    author: "goodness",
    likes: 9,
    url: "http/l@gmail.com",
  };

  await api
    .post("/api/blog")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBLogs.length + 1);

  const contents = blogsAtEnd.map((n) => n.title);
  expect(contents).toContain("money can buy hapiness");
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blog");

  const titles = response.body.map((r) => r.title);
  expect(titles).toContain("academics");
}, 100000);

afterAll(() => {
  mongoose.connection.close();
});
