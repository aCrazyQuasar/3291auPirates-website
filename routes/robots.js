import express from "express";
import { requireLogin } from "../middleware/auth.js";
import prisma from "../db.js";
import multer from "multer";
import { UTApi } from "uploadthing/server";

const router = express.Router();
const utapi = new UTApi();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
    const robots = await prisma.robot.findMany();
    res.json(robots);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const robot = await prisma.robot.findUnique({
            where: {
                id: parseInt(id, 10)
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

router.post("/", upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "modelFile", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { name, year, season, description, githubLink } = req.body;

      // Check if both files were uploaded successfully to Express
      if (!req.files || !req.files.imageFile || !req.files.modelFile) {
        return res.status(400).json({ error: "Both an image file and a 3D model file are required." });
      }

      const imgFileRaw = req.files.imageFile[0];
      const glbFileRaw = req.files.modelFile[0];

      // Convert multer buffers into standard File objects that UTApi expects
      const imageToUpload = new File([imgFileRaw.buffer], imgFileRaw.originalname, { type: imgFileRaw.mimetype });
      const modelToUpload = new File([glbFileRaw.buffer], glbFileRaw.originalname, { type: glbFileRaw.mimetype });

      // 1. Upload files directly from server memory to UploadThing cloud
      const [imgUploadResult, glbUploadResult] = await Promise.all([
        utapi.uploadFiles(imageToUpload),
        utapi.uploadFiles(modelToUpload)
      ]);

      // Handle any upload errors from UploadThing
      if (imgUploadResult.error || glbUploadResult.error) {
        console.error("Cloud Error:", imgUploadResult.error || glbUploadResult.error);
        return res.status(502).json({ error: "Failed uploading assets to cloud storage provider." });
      }

      // 2. Write everything to your Prisma database
      const newRobot = await prisma.robot.create({
        data: {
          name,
          year: parseInt(year, 10),
          season,
          description,
          githubLink: githubLink || "https://github.com/AuPiratesFIRST",
          // Clean up warnings by prioritizing ufsUrl directly
          image: imgUploadResult.data.ufsUrl, 
          imageKey: imgUploadResult.data.key,
          model: glbUploadResult.data.ufsUrl,
          modelKey: glbUploadResult.data.key
        }
      });

      res.status(201).json(newRobot);
    } catch (error) {
      console.error("❌ Complete Endpoint Error Breakdown:", error);
      res.status(500).json({ error: error.message || "Internal server crash." });
    }
});

// Express route handler example
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, githubLink } = req.body;

  try {
    const updatedRobot = await prisma.robot.update({
      where: { id: parseInt(id) }, // or just id if your DB uses UUID strings
      data: {
        name,
        description,
        githubLink
      }
    });
    
    res.json(updatedRobot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update database entry." });
  }
});

// DELETE route remains exactly the same
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const robot = await prisma.robot.findUnique({ where: { id: parseInt(id, 10) } });
    if (!robot) return res.status(404).json({ error: "Robot entry not found." });

    const keysToDelete = [robot.imageKey, robot.modelKey].filter(Boolean);
    if (keysToDelete.length > 0) await utapi.deleteFiles(keysToDelete);

    await prisma.robot.delete({ where: { id: parseInt(id, 10) } });
    res.status(200).json({ message: "Robot and cloud assets permanently deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete robot profile." });
  }
});

export default router;