import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/login.html"));
});

router.get("/dashboard", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/dashboard.html"));
});

export default router;