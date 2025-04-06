const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const Restaurant = require('./models/Restaurant')
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const orderRoutes = require("./routes/orderRoutes"); // 🔥 Fix Import
const menuRoutes = require("./routes/menuRoutes");
const payment = require("./routes/payment");



const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

app.use("/api", menuRoutes);
app.use("/api", payment);
app.use("/api/admin", adminRoutes, menuRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", loginRoutes);
// app.use("/api/orders", orderRoutes); // 🔥 FIXED ROUTE
app.use("/api", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.put("/add-menu/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { menu } = req.body; // Menu to be added

    // Find restaurant by adminId
    const restaurant = await Restaurant.findOne({ adminId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    // Update the menu field
    restaurant.menu = menu;
    await restaurant.save();

    res.json({ message: "Menu added successfully!", restaurant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = app; // Export the app if needed
