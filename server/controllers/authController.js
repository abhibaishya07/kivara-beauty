const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true, token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    
    const user = await User.create({ name, email, password, phone, isVerified: false });
    
    const otp = user.generateVerifyOtp();
    await user.save({ validateBeforeSave: false });

    const message = `Welcome to Kivara Beauty!\n\nYour verification code is: ${otp}\n\nThis code will expire in 15 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Kivara Beauty Account',
        message
      });
      res.status(201).json({ success: true, message: 'otp_sent' });
    } catch (err) {
      user.verifyOtp = undefined;
      user.verifyOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    
    // Explicitly check for both unverified users and invalid credentials
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
      
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email address to log in.', unverified: true });
    }
    
    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, { name, phone, address }, { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL pointing to frontend route
    const resetUrl = `${req.headers.origin || 'http://localhost:5173'}/resetpassword/${resetToken}`;

    // Development aid: Output to console since SMTP might not be set up
    console.log(`\n\n=== PASSWORD RESET LINK ===\n${resetUrl}\n===========================\n\n`);

    const message = `You are receiving this email because you (or someone else) have requested to reset your password.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Kivara Beauty - Password Reset Token',
        message
      });

      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Please provide email and OTP' });

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await User.findOne({
      email,
      verifyOtp: hashedOtp,
      verifyOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // Instantly log them in after verification
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Please provide email' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'There is no user with that email' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'User is already verified' });

    const otp = user.generateVerifyOtp();
    await user.save({ validateBeforeSave: false });

    const message = `Welcome to Kivara Beauty!\n\nYour new verification code is: ${otp}\n\nThis code will expire in 15 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Kivara Beauty Account',
        message
      });
      res.status(200).json({ success: true, message: 'otp_sent' });
    } catch (err) {
      user.verifyOtp = undefined;
      user.verifyOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (err) {
    next(err);
  }
};
