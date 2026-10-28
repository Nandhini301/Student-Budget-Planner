const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Transaction = require("./models/Transaction");

const app = express();

app.use(cors());
app.use(express.json());

// Test the API
app.get("/", (req, res) => {
  res.json({ message: "Student Budget Planner API is running" });
});

// Get all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch transactions" });
  }
});

// Add a transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a transaction
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid transaction ID" });
  }
});

// Connect to MongoDB and start the API
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 5000, () => {
      console.log("API running at http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });