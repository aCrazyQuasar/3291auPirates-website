import express from "express";
import { requireLogin } from "../middleware/auth.js";
import prisma from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const robots = await prisma.robot.findMany();
    res.json(robots);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const robot = await prisma.robot.findUnique({
            where: {
                id: id
            }
        });
        if (!robot) {
            return res.status(404).json({ error: "Robot not found" });
        }
        res.json(robot);
    } catch (error) {
        res.status(500).json({ error: "Database query failed" });
    }
});

export default router;