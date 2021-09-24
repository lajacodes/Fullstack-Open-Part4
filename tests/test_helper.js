const Blog = require("../models/blog");

const initialBLogs = [
  {
    title: "academics",
    author: "lajaMoney",
    likes: 6,
    url: "laja/000",
    id: "613602c85a846c79d8dce875",
  },
  {
    title: "books",
    author: "lajas",
    url: "laja/002",
    likes: 98765678290,
    id: "614c4522ff1a6f61d66b19e6",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "okay", likes: 2 });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBLogs,
  nonExistingId,
  blogsInDb,
};
