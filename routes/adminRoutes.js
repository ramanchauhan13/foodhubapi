const express = require("express");
const { Signup } = require("../controllers/AdminController");
const { addMenuSection, updateMenuItem, deleteMenuItem, deleteSection, updateSection } = require("../controllers/MenuController");
const { ExistingSection } = require("../controllers/ExistingSectionController");

const Restaurant = require("../models/Restaurant"); // Import restaurant model
const { upload } = require("../middleware/cloudinary");

const router = express.Router();

// 🛠️ Admin Signup Route
router.post("/signup", Signup);

// 🛠️ Add a new menu section
router.post("/restaurant/:id/menu", addMenuSection);

// 🛠️ Update an existing menu section
router.put("/restaurant/:id/menu/:sectionId", ExistingSection);

// 🛠️ Update a specific menu item within a section
router.put("/restaurant/:adminId/menu/:sectionId/item/:itemId", updateMenuItem);

// 🛠️ Delete a specific menu item from a section
router.delete("/restaurant/:adminId/menu/:sectionId/item/:itemId", deleteMenuItem);

// 🔄 Upload & Update Restaurant Image on Cloudinary
router.post("/:id/settings", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path; // ✅ Get uploaded image URL from Cloudinary

    // ✅ Store image URL in the restaurant document
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { adminId: req.params.id }, // Find the restaurant by owner ID
      { imageUrl },
      { new: true, upsert: true }
    );

    return res.json({
      message: "✅ Image uploaded successfully",
      imageUrl: updatedRestaurant.imageUrl, // Return the updated image URL
    });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return res.status(500).json({ error: "Image upload failed. Please try again." });
  }
});

router.get("/:id/settings", async (req, res) => {
  try {
    // Fetch restaurant and populate admin details
    const restaurant = await Restaurant.findOne({ adminId: req.params.id }).populate("adminId");

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Extract admin details
    const admin = restaurant.adminId; // Since adminId is now populated

    res.json({
      // Restaurant Details
      restaurantName: restaurant.restaurantName,
      imageUrl: restaurant.imageUrl || "",

      // Admin Details
    
        name: admin.name,
        email: admin.email,
        dob: admin.dob,
        mobile: admin.mobile,
      
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});





//update Section
router.put("/restaurant/:adminId/menu/:sectionId", updateSection);

// Delete section
router.delete("/restaurant/:adminId/menu/:sectionId", deleteSection);

module.exports = router;
