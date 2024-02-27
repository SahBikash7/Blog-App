const multer = require("multer");
const router = require("express").Router();
const userController = require("./user.controller");
const { checkRole } = require("../../utils/sessionManager");

const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/users");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

router.get("/", checkRole(["admin"]), async (req, res, next) => {
  try {
    const { name, phone, email, page, limit } = req.query;
    const search = { name, phone, email };
    const result = await userController.getAll(search, page, limit);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Register
router.post("/register", async (req, res, next) => {
  try {
    if (req.file) {
      req.body.profilePic = req.file.path.replace("public", "");
    }
    const result = await userController.register(req.body);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const result = await userController.logIn(req.body);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Generate Forget Password Token
router.post("/gen-fp-token", async (req, res, next) => {
  try {
    const result = await userController.generateFpToken(req.body);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Verify Forget Password Token
router.post("/verify-fp-token", async (req, res, next) => {
  try {
    const result = await userController.verifyFpToken(req.body);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Reset Password
// Make it be useable only by admin
router.post("/reset-password", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.resetPassword(req.body);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Change Password
router.post(
  "/change-password",
  checkRole(["admin", "user"]),
  async (req, res, next) => {
    try {
      const result = await userController.changePassword(req.body);
      res.json({ msg: result });
    } catch (err) {
      next(err);
    }
  }
);

// Create
router.post("/", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.create(req.body);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Get Profile
router.get("/get-profile", checkRole(["user"]), async (req, res, next) => {
  try {
    console.log(req.currentUser);
    const result = await userController.getProfile(req.currentUser);
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Update Profile
router.put("/update-profile", checkRole(["user"]), async (req, res, next) => {
  try {
    const result = await userController.updateProfile(
      req.currentUser,
      req.body
    );
    res.json({ msg: result });
  } catch (err) {
    next(err);
  }
});

// Dynamic-Routes at the end:
// getById
router.get("/:id", checkRole(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userController.getById(id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// updateById
router.put("/:id", checkRole(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userController.updateById(id, req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
