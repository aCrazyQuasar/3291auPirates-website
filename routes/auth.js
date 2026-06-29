import express from "express";
import prisma from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
        where: { username }
    });

    if (!admin) {
        return res.sendStatus(401);
    }

    const valid = await bcrypt.compare(
        password,
        admin.passwordHash
    );

    if (!valid) {
        return res.sendStatus(401);
    }

    req.session.loggedIn = true;
    req.session.username = admin.username;

    res.sendStatus(200);

});

router.post("/logout", (req, res) => {

    req.session.destroy(() => {
        res.sendStatus(200);
    });

});

export default router;