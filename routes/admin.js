import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { requireLogin } from "../middleware/auth.js";
import { requireLoginPage } from "../middleware/auth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/index.html"));
});

router.get("/dashboard", requireLoginPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/dashboard.html"));
});

export default router;