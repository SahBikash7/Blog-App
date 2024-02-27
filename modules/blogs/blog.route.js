const router = require("express").Router();

// TODO-Handle Pagination (page,limit)
router.get("/", async (req, res, next) => {
  try {
    const result = await blogController.getAll();
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
