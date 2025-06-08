const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt

const app = express();
const PORT = process.env.PORT || 3000;

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

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.static('database'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route handler for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route handler for the signup form submission
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Route handler for the sign-in form submission
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      // Compare the provided password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.status(200).json({ message: 'Sign in successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing in' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// // const cors = require('cors');
// const bcrypt = require('bcrypt');
// // const dotenv = require('dotenv');
// const path = require('path');

// // dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// mongoose.connect('mongodb://0.0.0.0:27017/utilityhub', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });



// const User = mongoose.model('User', {
//     username: String,
//     email: String,
//     password: String,
// });

// app.use(bodyParser.json());
// app.use(express.static('database'));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'signup.html'));
//   });
// app.post('/signup', async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//          // Check if the email already exists
//          const existingUser = await User.findOne({ email });
//          if (existingUser) {
//              return res.status(400).send('User with this email already exists.');
//          }
 
//          // Hash the password
//          const hashedPassword = await bcrypt.hash(password, 10);
 
//          // Create a new user
//          const newUser = new User({ username, email, password: hashedPassword });
 
//          // Save the user to the database
//          await newUser.save();
 
//          res.status(201).send('User registered successfully.');
//     } catch (error) {
//         if (error.code === 11000) {
//             res.status(400).send('User with this email already exists.');
//         } else {
//             console.error(error);
//             res.status(500).send('Error registering user.');
//         }
//     }
// });

// app.post('/signin', async (req, res) => {
//     // Your existing login code
//     const { email, password } = req.body;

//     try {
//         // Find the user by email
//         const user = await User.findOne({ email });

//         if (!user) {
//             // If the user does not exist, return 401 Unauthorized
//             return res.status(401).send('Invalid credentials.');
//         }

//         // Compare the provided password with the hashed password in the database
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (passwordMatch) {
//             // If passwords match, return 200 OK
//             res.status(200).send('Login successful.');
//         } else {
//             // If passwords do not match, return 401 Unauthorized
//             res.status(401).send('Invalid credentials.');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error during login.');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
  
