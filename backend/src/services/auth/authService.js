const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("../../repositories/authRepository");

/**
 * Register a new user
 */
async function register(userData) {
  const { email, password } = userData;

  // Check if email already exists
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const userId = await authRepository.createUser({
    ...userData,
    password: hashedPassword,
    role: "customer",
  });

  return {
    id: userId,
    message: "User registered successfully",
  };
}

/**
 * Login user
 */
async function login(email, password) {
  // Find user
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}

async function updateProfile(userId, email, phone) {
  // Check if user exists
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // If email changes, make sure it is not taken by another user
  if (email.toLowerCase() !== user.email.toLowerCase()) {
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Email is already registered by another account");
    }
  }

  // Update profile in DB
  await authRepository.updateUserProfile(userId, email, phone);

  // Fetch and return the updated user details
  const updatedUser = await authRepository.findUserById(userId);

  return {
    id: updatedUser.id,
    fullName: updatedUser.full_name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
  };
}

module.exports = {
  register,
  login,
  updateProfile,
};