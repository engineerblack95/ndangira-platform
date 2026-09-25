import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import {
  getStats,
  listUsers,
  updateUserRole,
  deleteUser,
  listAllItems,
  updateItemStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", getStats);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/items", listAllItems);
router.patch("/items/:id/status", updateItemStatus);

export default router;