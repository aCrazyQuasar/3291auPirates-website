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

// Check admins or smt
const admins = await prisma.admin.findMany();
console.log(admins);

// Serve everything inside /public and /uploads
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// Serve Routes
app.use("/api/robots", robotRoutes);
app.use("/api/admin", authRoutes);

// Smt
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});