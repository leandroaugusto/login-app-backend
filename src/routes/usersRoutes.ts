import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  updateUserById,
  updateUserPassword,
  deleteUserById,
} from "@/controllers/user";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUserById);
router.patch("/:id/update-password", authenticateToken, updateUserPassword);
router.patch("/:id/delete", authenticateToken, deleteUserById);

export default router;
