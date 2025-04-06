const bcrypt = require('bcrypt');
const UserSchema = require('../models/UserSchema');

// User Signup Route
const Signup = async (req, res) => {
  try {
    const { name, email, password, mobile, dob, department } = req.body;

    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User Already Exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserSchema({
      name,
      email,
      password: hashedPassword,
      mobile,
      dob,
      department,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error("Error in user registration:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update User Profile
const profileEdit = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await UserSchema.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add or Update Address Route
const addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const { classNumber, building, floor, mobileNumber } = req.body;

    if (!classNumber || !building || !floor || !mobileNumber) {
      return res.status(400).json({ error: "All address fields are required!" });
    }

    const updatedUser = await UserSchema.findByIdAndUpdate(
      userId,
      { $set: { address: { classNumber, building, floor, mobileNumber } } }, // ✅ Fix: Use $set
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({ message: "Address updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({ address: user.address });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { Signup, profileEdit, addAddress, getAddress };
