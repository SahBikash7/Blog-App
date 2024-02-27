const router = require("express").Router();
const blogRouter = require("../modules/blogs/blog.route");
const userRouter = require("../modules/users/user.route");
const apiIndex = "/api/v1";

router.get("/", (req, res, next) => {
  try {
    res.json({ msg: "Got the get request at Homepage!" });
  } catch (err) {
    next(err);
  }
});

router.use(`${apiIndex}/blogs`, blogRouter);
router.use(`${apiIndex}/users`, userRouter);

module.exports = router;
