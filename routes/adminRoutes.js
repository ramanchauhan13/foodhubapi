const express = require("express");
const { Signup } = require("../controllers/AdminController");
const { addMenuSection, updateMenuItem, deleteMenuItem, deleteSection, updateSection } = require("../controllers/MenuController");
const { ExistingSection } = require("../controllers/ExistingSectionController");

const Restaurant = require("../models/Restaurant"); // Import restaurant model
const AdminSchema = require("../models/AdminSchema"); // Import admin model
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

//for adding section images
router.post('/sections/image', async (req, res) => {
  const { section, imageUrl } = req.body;

  try {
    const result = await Restaurant.updateMany(
      {},
      { $set: { "menu.$[elem].sectionImg": imageUrl } },
      {
        arrayFilters: [{ "elem.section": section }],
      }
    );

    res.status(200).json({ message: "Image updated successfully", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Error updating section image:", err);
    res.status(500).json({ error: "Failed to update section image" });
  }
});


// PATCH: Update item image by item ID
router.patch("/menu/item/:id", async (req, res) => {
  const { id } = req.params; // menu item _id
  const { imageUrl } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ "menu.items._id": id });

    if (!restaurant) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    let updated = false;

    for (const section of restaurant.menu) {
      for (const item of section.items) {
        if (item._id.toString() === id) {
          item.itemImg = imageUrl; // Update correct field in schema
          updated = true;
          break;
        }
      }
      if (updated) break;
    }

    await restaurant.save();
    res.json({ success: true, message: "Image updated successfully." });
  } catch (error) {
    console.error("Error updating menu item image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;



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

router.patch("/:id/settings",async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const user = await AdminSchema.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//update Section
router.put("/restaurant/:adminId/menu/:sectionId", updateSection);

// Delete section
router.delete("/restaurant/:adminId/menu/:sectionId", deleteSection);

module.exports = router;
