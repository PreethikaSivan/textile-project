const Client = require('../models/Client');
const bcrypt = require('bcryptjs');

const registerClient = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newClient = new Client({
      name,
      email,
      password: hashedPassword,
    });

    await newClient.save();
    res.status(201).json({ message: 'Client registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', client });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

module.exports = { registerClient, loginClient };
