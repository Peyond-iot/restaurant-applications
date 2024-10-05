const MenuItem = require("../models/menuItem");
const path = require("path");
const fs = require("fs");

// Multer setup for image upload
const multer = require("multer");

// Storage setup for multer: define destination and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "localStorage/"); // Save files to 'localStorage' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., '1623761881784.jpg'
  },
});

// Set upload limits and file type restrictions
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB max file size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
  },
});

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new menu item with image upload
exports.createMenuItem = async (req, res) => {
  const menuItem = new MenuItem({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    size: req.body.size,
    description: req.body.description,
    imagePath: req.file
      ? `http://localhost:${process.env.PORT || 5000}/localStorage/${req.file.filename}`
      : null,
    // imagePath: req.file ? req.file.path : null, // Save the image path
  });

  try {
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a menu item (including image)
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    // Update fields
    menuItem.name = req.body.name || menuItem.name;
    menuItem.category = req.body.category || menuItem.category;
    menuItem.price = req.body.price || menuItem.price;
    menuItem.size = req.body.size || menuItem.size;
    menuItem.description = req.body.description || menuItem.description;

    // If there's a new image, update the path and remove the old image
    if (req.file) {
      if (menuItem.imagePath) {
        fs.unlinkSync(menuItem.imagePath); // Delete old image file
      }
      menuItem.imagePath = req.file.path; // Update to new image path
    }

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a menu item (also delete associated image file)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    // Delete associated image if exists
    if (menuItem.imagePath) {
      fs.unlinkSync(menuItem.imagePath); // Delete image from local storage
    }

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export multer's upload method to use in routes
exports.upload = upload;
