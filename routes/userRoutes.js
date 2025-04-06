const express = require('express');
// const Joi = require('joi');
const {Signup, profileEdit, addAddress, getAddress }=require('../controllers/userController');

const router = express.Router();

router.post('/signup', Signup);
router.patch('/:id/profile', profileEdit);
router.patch("/:userId/address", addAddress);
router.get("/:userId/address", getAddress);
  
module.exports = router;
