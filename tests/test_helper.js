const Blog = require("../models/blog");
const User = require("../models/user");

const initialBLogs = [
  {
    title: "academics",
    author: "lajaMoney",
    likes: 6,
    url: "laja/000",
    id: "613602c85a846c79d8dce875",
  },
  {
    title: "is okay",
    author: "lajaOlowo",
    url: "laj/000",
    likes: 2,
    id: "614c4522ff1a6f61d66b19e6",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "okay", author: orisa });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBLogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
