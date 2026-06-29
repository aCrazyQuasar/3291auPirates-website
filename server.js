import express from "express";
import prisma from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

dotenv.config();

// Allow JSON requests
app.use(express.json());

// Serve everything inside /public
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

await prisma.robot.create({
    data: {
        name: "Maroonosauros Rex",
        year: 2025,
        season: "FTC",
        image: "/uploads/robots/pictures/2025-ftc-marooned.png",
        description: "Our 2025 FTC robot.",
        model: "/uploads/robots/models/2025-ftc-marooned.glb"
    }
});

const robots = await prisma.robot.findMany();

console.log(robots);

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend works!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/api/robots", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Maroonosauros Rex",
            year: "2025-26",
            season: "FTC",
            picture: "/uploads/robots/pictures/2025-ftc-marooned.png"
        },
        {
            id: 2,
            name: "Pearls",
            year: "2025-26",
            season: "FTC",
            picture: "/uploads/robots/pictures/2025-ftc-pearls.png"
        },
        {
            id: 3,
            name: "Rebuilt Robot",
            year: "2025-26",
            season: "FRC",
            picture: "/uploads/robots/pictures/2026-frc-team3291.jpg"
        }
    ]);
});
app.get("/api/robots/1", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Maroonosauros Rex",
            year: "2025-26",
            season: "FTC",
            description: "This robot features a flywheel launcher...",
            picture: "/uploads/robots/pictures/2025-ftc-marooned.png",
            github: "https://github.com/AuPiratesFIRST/FTC-2025-Decode-Team19594",
            model: "/uploads/robots/models/2025-ftc-marooned.glb"
        }
    ]);
});