const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    classNumber: { type: String, required: true },
    building: { type: String, required: true },
    floor: { type: String, required: true },
    mobileNumber: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    dob: { type: Date, required: true },
    department: { type: String, required: true },
    role: { type: String, default:"user"},
    address: { type: AddressSchema, default: null },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    },{ timestamps: true });


module.exports = mongoose.model('User', UserSchema);