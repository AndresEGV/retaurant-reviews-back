const express = require("express");
const router = express.Router();

const {
  getRestaurants,
  getRestaurantById,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addReview,
} = require("../controllers/restaurant");

router.get("/api/v1/restaurants", getRestaurants);
router.get("/api/v1/restaurants/:id", getRestaurantById);

router.post("/api/v1/restaurants/", addRestaurant);
router.post("/api/v1/restaurants/:id/addReview", addReview);
router.put("/api/v1/restaurants/:id", updateRestaurant);

router.delete("/api/v1/restaurants/:id", deleteRestaurant);

module.exports = router;
