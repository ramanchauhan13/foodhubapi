const RestaurantSchema = require("../models/Restaurant");
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await RestaurantSchema.findOne({ adminId: req.params.id });


    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRestaurantByName = async (req, res) => {
  try {
    const { name } = req.params; // Extract the restaurant name from the URL parameter

    // Find the restaurant by name (case-insensitive search)
    const restaurant = await RestaurantSchema.findOne({ restaurantName: { $regex: new RegExp(name, 'i') } });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant); // Return the restaurant data
  } catch (error) {
    console.error("Error fetching restaurant by name:", error);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};
const getAllRestaurants = async(req,res)=>{
  try{
    const restaurant = await RestaurantSchema.find();
    res.json(restaurant);
  }
  catch(error){
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { getRestaurant,getAllRestaurants,getRestaurantByName };
