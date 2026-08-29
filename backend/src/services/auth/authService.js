const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authRepository = require("../../repositories/user/authRepository");
const emailService = require("../notification/emailService");
const bookingSessionRepository = require("../../repositories/booking/bookingSessionRepository");
const { hashToken } = require("../../utils/bookingSessionToken");

/**
 * Register a new user
 */
async function register(userData, rawToken) {
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

  // Bind existing booking session if any
  if (rawToken) {
    const sessionTokenHash = hashToken(rawToken);
    const session = await bookingSessionRepository.getSessionByHash(sessionTokenHash);
    if (session && session.status === 'ACTIVE' && new Date(session.expires_at) > new Date()) {
      await bookingSessionRepository.updateSession(session.id, { user_id: userId });
    }
  }

  return {
    id: userId,
    message: "User registered successfully",
  };
}

/**
 * Login user
 */
async function login(email, password, rawToken) {
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

  // Bind existing booking session if any
  if (rawToken) {
    const sessionTokenHash = hashToken(rawToken);
    const session = await bookingSessionRepository.getSessionByHash(sessionTokenHash);
    if (session && session.status === 'ACTIVE' && new Date(session.expires_at) > new Date()) {
      await bookingSessionRepository.updateSession(session.id, { user_id: user.id });
    }
  }

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

/**
 * Initiates a forgot password flow
 */
async function forgotPassword(email) {
  const user = await authRepository.findUserByEmail(email);

  // We return immediately to avoid revealing if the email exists or not.
  // We also restrict this specific reset flow to admins as requested,
  // but we do not throw an error if the user is a customer to prevent enumeration.
  if (!user || user.role !== 'admin') {
    return true; 
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  
  // Expiry in 30 minutes
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const formattedExpiresAt = expiresAt.toISOString().slice(0, 19).replace('T', ' ');

  await authRepository.updateResetToken(email, hashedToken, formattedExpiresAt);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/admin/reset-password?token=${rawToken}`;

  await emailService.sendPasswordResetEmail(email, resetUrl);

  return true;
}

/**
 * Resets a password using a valid token
 */
async function resetPassword(token, newPassword) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await authRepository.findUserByResetToken(hashedToken);
  
  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // This will also nullify the reset token to ensure it's single-use
  await authRepository.updatePassword(user.id, hashedPassword);

  return true;
}

module.exports = {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
};