const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Allow JSON requests
app.use(express.json());

// Serve everything inside /public
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend works!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});