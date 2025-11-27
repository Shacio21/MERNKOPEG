const FormDataModel = require('../models/auth');
// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FormDataModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No records found!' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    res.json({ message: 'Success', name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REGISTER USER (opsional, bisa dipakai nanti)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await FormDataModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    const newUser = await FormDataModel.create({ name, email, password });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
