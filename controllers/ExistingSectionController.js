const RestaurantSchema = require("../models/Restaurant");

const ExistingSection = async (req, res) => {
  const { adminId, sectionId } = req.params;
  const { items } = req.body;

  try {
    const restaurant = await RestaurantSchema.findOne({ adminId:req.params.id });
    // console.log(restaurant);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const section = restaurant.menu.id(sectionId);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Append new items to the existing section
    section.items.push(...items);
    await restaurant.save();

    res
      .status(200)
      .json({
        message: "Items added to the section successfully",
        menu: restaurant.menu,
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to update section" });
  }
};

module.exports={ExistingSection};