const express = require("express");
const { getRestaurant, getAllRestaurants, getRestaurantByName } = require("../controllers/RestaurantController");

const router = express.Router();

router.get("/home", getAllRestaurants);

// GET restaurant details by ID
router.get("/restaurant/:id", getRestaurant);

router.get('/home/:name',getRestaurantByName);

// router.get('/restaurant/:name',getRestaurantByName);



module.exports = router;