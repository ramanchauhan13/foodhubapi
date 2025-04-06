const getAllOrdersForAdmin = async (req, res) => {
    try {
        const adminId = req.admin.id;  // Assuming admin is authenticated
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const restaurantId = admin.restaurantId; // Assuming admin has a restaurantId field

        const orders = await Order.find({ "orders.restaurantId": restaurantId }).populate("userId").populate("orders.restaurantId");

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
