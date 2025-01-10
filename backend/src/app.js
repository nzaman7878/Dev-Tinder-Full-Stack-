const express = require("express");


const app = express();

// Route to get user data
app.get("/getUserData", (req, res) => {
    try {
        // Logic to interact with the database and get user data
        throw new Error("Database error occurred"); // Simulating an error
        res.send("User Data sent"); // This won't be reached due to the error above
    } catch (err) {
        res.status(500).send("Some error occurred. Please contact the support team.");
    }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging purposes
    res.status(500).send("Something went wrong. Please try again later.");
});

// Start the server
app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});
