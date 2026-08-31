const mongoose = require("mongoose");
const Medicine = new mongoose.Schema({
    name: {type: String, required: true},
    expiryDate: {type: Date, required: true},
    numberOfPackets: {type: Number, required: true},
    quantity: {type: Number, required: true},
    unit: {type: String, required: true},
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    }
});

const MedicineItem = mongoose.model("MedicineItem", Medicine);
module.exports = MedicineItem;