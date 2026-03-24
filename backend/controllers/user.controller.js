
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import admin from "../config/firebaseAdmin.js"

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }


    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Google OAuth Login / Register
// export const googleAuthUser = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     // Validation
//     if (!name || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide name and email",
//       });
//     }

//     // Check if user exists
//     let user = await User.findOne({ email });

//     // If user doesn't exist, create new user with Google auth
//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         // No password for Google OAuth users
//       });
//     } else {
//       // Update name if it changed
//       if (user.name !== name) {
//         user.name = name;
//         await user.save();
//       }
//     }

//     // Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;

//     return res.status(200).json({
//       success: true,
//       message: "Google authentication successful",
//       user: userResponse,
//     });
//   } catch (error) {
//     console.error("Google Auth Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };
export const googleAuthUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required",
      });
    }

    // ✅ Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    const { email, name, picture } = decoded;

    // Check if user exists
    let user = await User.findOne({ email });

    // Create if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
      });
    }

    // Remove password
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
    });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
