const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // References Admin collection
    required: true,
    unique: true, // Ensures one admin per restaurant
    index: true,
  },
  adminName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  restaurantName: { type: String, required: true, unique: true, index:true },
  imageUrl: { type: String, default: "" },
  menu: [
    {
      section: { type: String, required: true },
      sectionImg:{ type: String, default: "" },
      items: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true, min: 0 },
          itemImg:{ type: String, default: "" },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically adds timestamp
  },
});

// Export the model
module.exports = mongoose.model("Restaurant", RestaurantSchema);
