const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, curr) => total + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  const highest = Math.max(...blogs.map((fav) => fav.likes));
  return blogs.find((fav) => fav.likes === highest);
};

const mostBlog = (blogs) => {
  const mostObject = {};

  blogs.forEach((blo) => {
    if (mostObject[blo.author]) mostObject[blo.author] += 1;
    else mostObject[blo.author] = 1;
  });
  return Object.entries(mostObject)
    .map((blo) => ({ author: blo[0], blog: blo[1] }))
    .sort((a, b) => b.blog - a.blog)[0];
};

const mostlikes = (blogs) => {
  const mostObject = {};
  blogs.forEach((blo) => {
    if (mostObject[blo.author]) mostObject[blo.author] += blo.likes;
    else mostObject[blo.author] = blo.likes;
  });
  return Object.entries(mostObject)
    .map((blo) => ({ author: blo[0], likes: blo[1] }))
    .sort((a, b) => b.likes - a.likes)[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostlikes,
};
