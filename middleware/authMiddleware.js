// const jwt = require('jsonwebtoken');
// const AdminSchema = require('../models/AdminSchema');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = await AdminSchema.findById(decoded.id);
//     if (!req.admin) return res.status(404).json({ message: "Admin not found" });

//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };