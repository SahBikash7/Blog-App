const blogModel = require("./blog.model");
const bookMarkModel = require("../bookmarks/bookmark.model");

const create = (payload) => {
  return;
};

const getAll = () => {
  return;
};

const getById = (_id) => {};

const updateById = (_id, payload) => {};

const removeById = (_id) => {};

const bookMark = (payload) => {
  const { blogs, user } = payload;
  if (!blogs.length > 0) throw new error("Blog is Missing.");
  if (!user) throw new error("User is Missing.");
  bookMarkModel.create(payload);
};

const authorSpecificBlog = (userId) => {};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  removeById,
  bookMark,
  authorSpecificBlog,
};
