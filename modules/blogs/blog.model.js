const { Schema, model } = require("mongoose");

const { ObjectId } = Schema.Types;

const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  author: { type: ObjectId, ref: "User", required: true },
  publishedDate: {
    type: Date,
    required: true,
    default: new Date().toLocaleDateString(),
  },
  content: { type: String, required: true },
  categories: { type: Array },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = new model("Blog", blogSchema);
