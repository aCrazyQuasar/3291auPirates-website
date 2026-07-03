import express from "express";
import { requireLogin } from "../middleware/auth.js";
import prisma from "../db.js";
import { UTApi } from "uploadthing/server";

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
router.post("/", requireLogin, async (req, res) => {
    const { 
        name, 
        year, 
        season, 
        description, 
        githubLink, 
        image, 
        imageKey, 
        model, 
        modelKey 
    } = req.body;
    try {
        const newRobot = await prisma.robot.create({
        data: {
            name,
            year: parseInt(year),
            season,
            description,
            githubLink,
            image,     
            imageKey,  
            model,     
            modelKey   
        }
        });
        res.status(201).json(newRobot);
    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({ error: "Failed to save robot display to database." });
    }
});
router.delete("/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  try {
    const robot = await prisma.robot.findUnique({
      where: { id: parseInt(id) }
    });
    if (!robot) {
      return res.status(404).json({ error: "Robot not found" });
    }

    const keysToDelete = [];
    if (robot.imageKey) keysToDelete.push(robot.imageKey);
    if (robot.modelKey) keysToDelete.push(robot.modelKey);
    if (keysToDelete.length > 0) {
      await utapi.deleteFiles(keysToDelete);
    }

    await prisma.robot.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Robot and cloud files deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete robot." });
  }
});

export default router;