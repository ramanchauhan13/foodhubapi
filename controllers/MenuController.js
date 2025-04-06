const RestaurantSchema = require("../models/Restaurant");

const addMenuSection = async (req, res) => {
  try {
    const { section, items } = req.body;

    if (!section || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const restaurant = await RestaurantSchema.findOneAndUpdate(
      { adminId: req.params.id },
      { $push: { menu: { section, items } } },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Menu section added successfully!", restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMenuItem = async (req, res) => {
  try {
      const { adminId, sectionId, itemId } = req.params;
      const { name, price } = req.body;
      console.log(req.body);
      console.log(req.params);

      const restaurant = await RestaurantSchema.findOneAndUpdate(
          { adminId, "menu._id": sectionId, "menu.items._id": itemId },
          { $set: { "menu.$[].items.$[item].name": name, "menu.$[].items.$[item].price": price } },
          { arrayFilters: [{ "item._id": itemId }], new: true }
      );

      if (!restaurant) return res.status(404).json({ message: "Restaurant or item not found" });

      res.json(restaurant);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const updateSection = async (req, res) => {
  return res.status(200).json({ message: "Update section endpoint hit" });
  const { adminId, sectionId } = req.params;
  const { section } = req.body;
  
  console.log("Received Params:", req.params);
  console.log("Received Body:", req.body);
  

  try {
    const restaurant = await RestaurantSchema.findOne({ adminId: adminId });
    console.log("Found Restaurant:", restaurant);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    console.log("Checking Section ID in menu:", sectionId);
    const sectionToUpdate = restaurant.menu.id(sectionId);
    console.log("Section Found:", sectionToUpdate);

    if (!sectionToUpdate) {
      return res.status(404).json({ message: "Section not found" });
    }

    sectionToUpdate.section = section;
    console.log("Updated Section Data:", sectionToUpdate);

    await restaurant.save();
    console.log("Restaurant updated successfully");

    res.json(restaurant);
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteMenuItem =  async (req, res) => {
  try {
      const { adminId, sectionId, itemId } = req.params;

      const restaurant = await RestaurantSchema.findOneAndUpdate(
          { adminId, "menu._id": sectionId },
          { $pull: { "menu.$.items": { _id: itemId } } },
          { new: true }
      );

      if (!restaurant) return res.status(404).json({ message: "Restaurant or item not found" });

      res.json(restaurant);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const deleteSection = async (req, res) => {
  console.log(req.params);
  try {
    const restaurant = await RestaurantSchema.findOne({ adminId: req.params.adminId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.menu.pull({ _id: req.params.sectionId });
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { addMenuSection ,updateMenuItem,deleteMenuItem,deleteSection,updateSection};
