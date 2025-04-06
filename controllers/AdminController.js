const AdminSchema = require("../models/AdminSchema"); // CommonJS `require`
const bcrypt = require("bcrypt");
const RestaurantSchema = require("../models/Restaurant");


const Signup = async (req, res) => {
  try {
    const { name, email, password, restaurantName, dob, mobile } = req.body;
    if(typeof name!='string'){
      return res.status(400).json({message: "Name Not Valid"});
    }
    // Check if the user already exists
    const admin = await AdminSchema.findOne({ email });
    if (admin) {
      console.log("Admin already exists:", email);
      return res.status(400).json({ message: "Admin already exists" });
    }

    const restaurantExists = await RestaurantSchema.findOne({ restaurantName });
    if (restaurantExists) {
      return res.status(400).json({ message: "Restaurant name already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create a new user
    const newAdmin = new AdminSchema({
      name,
      email,
      password: hashedPassword,
      restaurantName,
      dob,
      mobile,
    });
    // Save the user to the database
    await newAdmin.save();

    //Create Restaurant
    const newRestaurant = new RestaurantSchema({
      adminId: newAdmin._id, // Link admin to restaurant
      adminName: name,
      email,
      restaurantName,
      menu: [], // Start with an empty menu
    });

    await newRestaurant.save();

    //else
    res.status(201).json({ message: "Admin and Restaurant created successfully" });
  } catch (error) {
    console.error("Error in admin registration:", error);
    res.status(500).json({ message: "Registration failed! Please try again." });
  }
};

// Export Signup function using module.exports (CommonJS)
module.exports = { Signup };
