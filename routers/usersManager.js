import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware.js";
import UserModel from "../dao/models/user.model.js";
import logger from "../utils/logger.js";

const router = Router();

router.get("/", isAdmin, async (req, res) => {
  const user = req.user;
  const users = await UserModel.find().lean();

  logger.http(`/api/users (admin dashboard) ${user.email}`);
  res.status(200).render("users-manager", { users });
});

router.post("/delete-inactive-users", isAdmin, async (req, res) => {
  const user = req.user.email;
  try {
    const twentyMinutesAgo = new Date();
    twentyMinutesAgo.setMinutes(twentyMinutesAgo.getMinutes() - 20);

    const deletedUsers = await UserModel.deleteMany({
      last_login: { $lt: twentyMinutesAgo },
    });

    logger.info(
      `Admin (${user}) deleted ${deletedUsers.deletedCount} inactive users`
    );

    res.status(200).redirect("/api/users");
  } catch (err) {
    logger.error(`
      An error ocurred while deleting inactive users.
      ${err.stack} 
    `);
    res
      .status(500)
      .json({ err: "An error ocurred while deleting inactive users" });
  }
});

export default router;
