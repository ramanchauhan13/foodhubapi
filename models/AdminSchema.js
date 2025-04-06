const { Schema, model } = require("mongoose");

const AdminSchema = new Schema({
  name: { type: String, required: true },
  role: {type: String, default:'admin'},
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  restaurantName: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  mobile: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Admin", AdminSchema);
