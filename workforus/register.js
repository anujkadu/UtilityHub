const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5500;

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/utilityhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema and model
const serviceproviderSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  email: String,
  phoneNumber: String,
  password: String,
  gender: String,
  // Add other fields as needed
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceproviderSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('workforus')); // Serve static files like CSS

// Define route handler for GET request to the registration page
app.get('/register', (req, res) => {
  // Construct the absolute path to the register.html file in the public directory
  const filePath = path.join(__dirname, 'register.html');

  // Serve the register.html file
  res.sendFile(filePath);
});

// Redirect requests to the root URL to the registration page
app.get('/', (req, res) => {
  res.redirect('/register'); // Redirect to your registration page or another relevant page
});

// Routes
app.post('/register', (req, res) => {
  const { fullName, username, email, phoneNumber, password, confirmPassword, gender } = req.body;

  // Check if password matches confirmPassword
  if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
  }

  // Proceed with registration if passwords match
  const serviceProviderData = { fullName, username, email, phoneNumber, password, gender };
  const serviceProvider = new ServiceProvider(serviceProviderData);
  serviceProvider.save()
      .then(() => {
          res.send('Service provider registered successfully');
          //res.redirect('/home.html')
      })
      .catch((err) => {
          res.status(400).send('Service provider registration failed');
      });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
