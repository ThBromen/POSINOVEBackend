import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';  

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ message: 'User already exists' });  

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);

  
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,  
      sameSite: 'Lax',
    });

    return res.status(201).json({ 
      user: {
        message: 'User registered successfully', 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        token: token 
      } 
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) 
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });


    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: token
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDashboard = (req, res) => {
  res.json({ message: `Welcome to your dashboard, user ID: ${req.user.id}` });
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};
