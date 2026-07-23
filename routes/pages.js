import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Main site Pages
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});
router.get("/robots", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/pages/robots.html"));
});
router.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/pages/about.html"));
})

// Error Pages
router.get("/404", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/errors/404.html"));
});
router.get("/401", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/errors/401.html"));
});
router.get("/500", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/errors/500.html"));
});

export default router;