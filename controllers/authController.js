import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

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

// ĐÂY LÀ HÀM MỚI CHO AUTO LOGIN
export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, avatar FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User không tồn tại' });
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};