import express from "express";

import * as threadController from "../controller/threadController.js";

const router = express.Router();

router.get("/", threadController.getItems);
router.post("/", threadController.createItem);
router.delete("/:id", threadController.deleteItem);
// TODO3: add a router for the filter function
router.get("/filter", threadController.filterItems);
export default router;