require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PantryItem = require("./models/PantryItems");
const MedicineItem = require("./models/MedicineItems");
const app = express();
const authRoutes = require("./routes/auth");
const protect = require("./middleware/authMiddleware");
app.use(cors({
  origin: [
    "https://expiry-tracker-sand.vercel.app",
    "http://localhost:5173"
  ]
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
const MongoURI = process.env.MONGO_URI;

mongoose.connect(MongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Connection error", err));

//API Routes for Pantry Items
app.get("/api/pantry", protect, async (req, res) => {
  try {
    const items = await PantryItem.find({ userId: req.user.userId });
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/api/pantry", protect, async (req, res) => {
  try {
    const newItem = await PantryItem.create({ ...req.body, userId: req.user.userId });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(400).json({ error: "Failed to create item" });
  }
});

app.delete("/api/pantry/:id", protect, async (req, res) => {
  try {
    const deletedItem = await PantryItem.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted", deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.put("/api/pantry/:id", protect, async (req, res) => {
  try {
    const updatedItem = await PantryItem.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(400).json({ error: "Failed to update item" });
  }
});

//API Routes for Medicine Items
app.get("/api/medicine", protect, async (req, res) => {
  try {
    const items = await MedicineItem.find({ userId: req.user.userId });
    res.json(items);
  } catch (error) {
    console.error("Error fetching medicine items:", error);
    res.status(500).json({ error: "Failed to fetch medicine items" });
  }
});

app.post("/api/medicine", protect, async (req, res) => {
  try {
    const newItem = await MedicineItem.create({ ...req.body, userId: req.user.userId });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating medicine item:", error);
    res.status(400).json({ error: "Failed to create medicine item" });
  }
});

app.put("/api/medicine/:id", protect, async (req, res) => {
  try {
    const updatedItem = await MedicineItem.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating medicine item:", error);
    res.status(400).json({ error: "Failed to update medicine item" });
  }
});

app.delete("/api/medicine/:id", protect, async (req, res) => {
  try {
    const deletedItem = await MedicineItem.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted", deletedItem });
  } catch (error) {
    console.error("Error deleting medicine item:", error);
    res.status(500).json({ error: "Failed to delete medicine item" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});