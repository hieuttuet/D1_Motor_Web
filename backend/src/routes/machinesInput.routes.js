import express from "express";
import upload from "../middlewares/upload.js";
import { addMachinesInputController as createMachineInputController } from "../controllers/machinesInput.controller.js";

const router = express.Router();

// nhận tối đa 4 ảnh từ field "image"
router.post("/machines-input", upload.array("image", 4), createMachineInputController);

export default router;
