const router = require('express').Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// All staff routes require authentication
router.use(protect);

// GET /api/staff — list all staff (Admin only)
router.get('/', authorize('Admin'), async (req, res) => {
  try {
    const { search, role, page = 1, limit = 25 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { username:  { $regex: search, $options: 'i' } },
        { contact:   { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const staff = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ staff, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/staff/:id — get single staff
router.get('/:id', authorize('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Staff not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/staff — create staff (Admin only)
router.post('/', authorize('Admin'), async (req, res) => {
  try {
    const { firstName, lastName, email, contact, address, username, password, role, permissions } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const user = await User.create({
      firstName, lastName, email, contact, address,
      username, password,
      role: role || 'Staff',
      permissions: permissions || []
    });

    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Username already exists' });
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/staff/:id — update staff (Admin only)
router.put('/:id', authorize('Admin'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // If password is provided, update it via save() to trigger hashing
    if (password) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Staff not found' });
      Object.assign(user, updateData);
      user.password = password;
      await user.save();
      const { password: _, ...userData } = user.toObject();
      return res.json(userData);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Staff not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/staff/:id/permissions — update permissions (Admin only)
router.put('/:id/permissions', authorize('Admin'), async (req, res) => {
  try {
    const { permissions } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Staff not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/staff/:id/toggle — toggle active status
router.put('/:id/toggle', authorize('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Staff not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/staff/:id (Admin only)
router.delete('/:id', authorize('Admin'), async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
