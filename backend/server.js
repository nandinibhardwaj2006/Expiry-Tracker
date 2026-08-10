require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PantryItem = require("./models/PantryItems");
const MedicineItem = require("./models/MedicineItems");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const MongoURI = process.env.MONGO_URI;

mongoose.connect(MongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Connection error", err));

//API Routes for Pantry Items
app.get("/api/pantry", async (req, res) => {
  try {
    const items = await PantryItem.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/api/pantry", async (req, res) => {
  try {
    const newItem = await PantryItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(400).json({ error: "Failed to create item" });
  }
});

app.delete("/api/pantry/:id", async (req, res) => {
  try {
    const deletedItem = await PantryItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted", deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.put("/api/pantry/:id", async (req, res) => {
  try {
    const updatedItem = await PantryItem.findByIdAndUpdate(
      req.params.id,
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
app.get("/api/medicine", async (req, res) => {
  try {
    const items = await MedicineItem.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching medicine items:", error);
    res.status(500).json({ error: "Failed to fetch medicine items" });
  }
});

app.post("/api/medicine", async (req, res) => {
  try {
    const newItem = await MedicineItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating medicine item:", error);
    res.status(400).json({ error: "Failed to create medicine item" });
  }
});

app.put("/api/medicine/:id", async (req, res) => {
  try {
    const updatedItem = await MedicineItem.findByIdAndUpdate(
      req.params.id,
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

app.delete("/api/medicine/:id", async (req, res) => {
  try {
    const deletedItem = await MedicineItem.findByIdAndDelete(req.params.id);
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