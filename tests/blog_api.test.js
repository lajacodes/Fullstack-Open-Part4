const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

// beforeEach(async () => {
//   await Blog.deleteMany({});
//   let blogObject = new Blog(helper.initialBLogs[0]);
//   await blogObject.save();

//   blogObject = new Blog(helper.initialBLogs[1]);
//   await blogObject.save();
// });

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBLogs);
});

describe("when there is initially some blogs saved", () => {
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

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blog");

    const titles = response.body.map((r) => r.title);
    expect(titles).toContain("academics");
  }, 100000);
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogAtStart = await helper.blogsInDb();

    const blogToView = blogAtStart[0];

    const resultNote = await api
      .get(`/api/blog/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultNote.body).toEqual(processedBlogToView);
  });
});

describe("addition of a new blogs", () => {
  test("unique identify property of blog posts", async () => {
    const response = await api.get("/api/blog");

    expect(response.body[0].id).toBeDefined();
  }, 100000);

  test("a valid blog can be added ", async () => {
    const newBlog = {
      title: "money can buy hapiness",
      author: "goodness",
      url: "http/l@gmail.com",
      likes: 3,
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
  }, 100000);

  test("if likes property is missing add it", async () => {
    const newBlog = {
      title: "money cant buy hapiness",
      author: "goodnesss",
      url: "http/l@gmails.com",
    };

    await api
      .post("/api/blog")
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const lastBlog = blogsAtEnd.find(
      (item) => item.title === "money cant buy hapiness"
    );
    expect(lastBlog.likes).toBeDefined;
  }, 100000);

  test("url and title are missing", async () => {
    const newBlog = {
      author: "okay",
    };
    await api.post("/api/blog").send(newBlog).expect(400);
  }, 100000);
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogsToDelete = blogsAtStart[0];

    await api.delete(`/api/blog/${blogsToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBLogs.length - 1);

    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).not.toContain(blogsToDelete.title);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
