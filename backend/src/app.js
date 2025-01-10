const express = require("express");
const { adminAuth } = require("./middleware/auth");

const app = express();

// Middleware for admin routes
app.use("/admin", adminAuth);

// User route
app.get("/user", (req, res) => {
    res.send("User data sent");
});

// Admin routes
app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Delete a user");
});

// Start the server
app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});
