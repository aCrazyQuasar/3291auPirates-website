import express from "express";
import { requireLogin } from "../middleware/auth.js";
import prisma from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const robots = await prisma.robot.findMany();
    res.json(robots);
});

router.get("/:id", async (req, res) => {
    res.json({
        id: req.params.id
    });
});

export default router;