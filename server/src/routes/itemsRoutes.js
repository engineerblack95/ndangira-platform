import express from "express";
import {
  listItems,
  getItem,
  createItem,
  deleteItem,
} from "../controllers/itemsController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", listItems);
router.get("/:id", getItem);
router.post("/", upload.array("images", 5), createItem);
router.delete("/:id", deleteItem);

export default router;