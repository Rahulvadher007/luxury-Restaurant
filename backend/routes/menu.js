import express from 'express';
import Menu from '../models/Menu.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Seed initial items if database is empty helper
const seedMenuItems = async () => {
  const count = await Menu.countDocuments();
  if (count === 0) {
    const items = [
      {
        name: 'Miyazaki Wagyu Steak',
        description: 'A5 Miyazaki Wagyu, Truffle Jus, Smoked Sea Salt, 24k Gold Leaf flakes.',
        price: '$180',
        category: 'food',
        chefRecommendation: true,
        image: '/wagyu_steak.png',
      },
      {
        name: 'Black Truffle Tagliolini',
        description: 'Fresh House Pasta, Cream of Parmigiano Reggiano, Shaved French Black Truffles.',
        price: '$75',
        category: 'food',
        chefRecommendation: false,
        image: '/truffle_pasta.png',
      },
      {
        name: 'Lobster Thermidor Aurum',
        description: 'Native Lobster, Cognac Cream, Gruyère Gratin, Tarragon, Mustard.',
        price: '$110',
        category: 'food',
        chefRecommendation: true,
        image: '/lobster_thermidor.png',
      },
      {
        name: 'Golden Elixir Soufflé',
        description: 'Grand Marnier Chocolate, Edible Gold Leaf Coating, Madagascan Vanilla Ice Cream.',
        price: '$45',
        category: 'dessert',
        chefRecommendation: true,
        image: '/gold_leaf_dessert.png',
      },
    ];

    await Menu.insertMany(items);
    console.log('[Database Seed] Seeding completed: 4 signature dishes stored.');
  }
};

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Perform checking seeder
    await seedMenuItems();
    
    const menuItems = await Menu.find({});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/menu
// @desc    Create a new menu item
// @access  Private (Super Admin, Manager)
router.post('/', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const menuItem = await Menu.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Private (Super Admin, Manager)
router.put('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private (Super Admin, Manager)
router.delete('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    
    await menuItem.deleteOne();
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
