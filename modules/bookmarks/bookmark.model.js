const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const bookmarkSchema = new Schema({
  blogs: [{ type: ObjectId, required: true, ref: "Blog" }],
  user: { type: ObjectId, ref: "User", required: true },
});

module.exports = new model("Bookmark", bookmarkSchema);
