const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");

// Get all menu items
router.get("/", menuItemController.getAllMenuItems);

// Create a new menu item
router.post("/", menuItemController.createMenuItem);

// Get a menu item by ID
router.get("/:id", menuItemController.getMenuItemById);

// Update a menu item by ID
router.put("/:id", menuItemController.updateMenuItem);

// Delete a menu item by ID
router.delete("/:id", menuItemController.deleteMenuItem);

module.exports = router;
