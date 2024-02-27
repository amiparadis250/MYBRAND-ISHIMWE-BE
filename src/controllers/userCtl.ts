import User from '../model/User';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import getTokenFromHeader from '../utils/getTokenFromHeader'; 

export const registerUser = async (req:any, res:any) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.json({
        status: 'error',
        msg: 'User already exists',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.json({
        status: 'error',
        msg: 'Wrong login credentials',
      });
    }

    // Check password validity
    const isPasswordMatched = await bcrypt.compare(password, userFound.password);
    if (!isPasswordMatched) {
      return res.json({
        status: 'error',
        msg: 'Wrong login credentials',
      });
    }

    res.json({
      status: 'success',
      data:{
        id: userFound.id,
       fullName: userFound.fullName,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        token: generateToken(userFound.id)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
//getting user information by ID
export const getUserProfileById = async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
  


    const user = await User.findById(req.userAuth);

    if (!user) {
      return res.json({
        status: 'error',
        msg: 'User not found',
       
      });
    }

    res.json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      userId: req.params.id, 
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Assuming you have an authentication middleware that sets req.user
    
    const allUsers = await User.find();

    res.json({
      status: 'success',
      data: allUsers,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
export const deleteUserProfileById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);

    res.json({
      status: 'success',
      data: 'User account deleted',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
