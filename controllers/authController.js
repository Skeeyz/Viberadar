import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import redisClient from '../config/redis.ts';
import transporter from '../config/mailer.ts';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Email không tồn tại!' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu không chính xác!' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Đăng nhập thành công!', token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email đã tồn tại!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký!' });
  }
};

export const facebookLogin = async (req, res) => {
  const { accessToken } = req.body;
  try {
    const fbResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const { name, email, picture } = fbResponse.data;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = users[0];

    if (users.length === 0) {
      const [result] = await db.query('INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)', [name, email, 'fb_no_pass', picture.data.url]);
      user = { id: result.insertId, name, email, avatar: picture.data.url };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Facebook Login thành công!', token, user });
  } catch (error) {
    res.status(400).json({ message: 'Xác thực Facebook thất bại!' });
  }
};

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const { name, email, picture } = ticket.getPayload();

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = users[0];

    if (users.length === 0) {
      const [result] = await db.query('INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)', [name, email, 'google_no_pass', picture]);
      user = { id: result.insertId, name, email, avatar: picture };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Google Login thành công!', token, user });
  } catch (error) {
    res.status(400).json({ message: 'Xác thực Google thất bại!' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, avatar FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User Not Found' });
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const userId = req.user?.id;

  try {
    if (!password || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: 'New password cannot be the same as the current one.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    return res.status(200).json({ message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email không tồn tại trên hệ thống!' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await redisClient.set(`reset:${resetToken}`, email, {
      EX: 600 
    });


    const resetUrl = `${process.env.FRONTEND_URL || 'https://localhost:5173'}/auth/reset-password?token=${resetToken}`;
    

    await transporter.sendMail({
      to: email,
      subject: 'VibeRadar - Reset Your Password',
      html: `
        <div style="font-family: sans-serif; background: #020617; color: white; padding: 20px;">
          <h2>Reset Password Request</h2>
          <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
          <a href="${resetUrl}" style="background: #22d3ee; color: #020617; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
        </div>
      `
    });

    res.status(200).json({ message: 'Link khôi phục đã được gửi vào Email của bạn!' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Lỗi server khi gửi mail!' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Missing data' });
    }

    const email = await redisClient.getDel(`reset:${token}`);

    if (!email) {
      return res.status(400).json({ message: 'Token expired or invalid!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    res.status(200).json({
      message: 'Password updated successfully! Sign In again, please!'
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error!' });
  }
};

export const checkResetToken = async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) {
      return res.status(400).json({ valid: false, message: 'Token is required' });
    }

    const email = await redisClient.get(`reset:${token}`);

    if (!email) {
      return res.status(400).json({ 
        valid: false, 
        message: 'This reset link has expired or is invalid.' 
      });
    }

    res.status(200).json({ 
      valid: true, 
      message: 'Token is valid' 
    });

  } catch (error) {
    console.error('Check Token Error:', error);
    res.status(500).json({ valid: false, message: 'Server error' });
  }
};
