import express from "express";
import prisma from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import bcrypt from "bcrypt";

// Routes
import robotRoutes from "./routes/robots.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

dotenv.config();

// Allow JSON requests
app.use(express.json());

// Cookies yummy
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: false, // true when using HTTPS in production
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Serve everything inside /public and /uploads
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// Serve Routes
app.use("/api/robots", robotRoutes);
app.use("/api/admin", authRoutes);
app.use("/admin", adminRoutes);

// Smt
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// 404 page
app.use((req, res) => {
    res.status(404).sendFile(
        path.join(__dirname, "public/errors/404.html")
    );
});

// 500 page
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).sendFile(
        path.join(__dirname, "public/errors/500.html")
    );
});