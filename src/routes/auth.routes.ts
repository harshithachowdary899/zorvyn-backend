import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { run, get } from '../db';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../validations/schemas';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-for-dev';

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, role = 'VIEWER' } = req.body;
    
    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    await run(
      'INSERT INTO users (id, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [id, email, hashedPassword, role, 'ACTIVE']
    );

    res.status(201).json({ message: 'User registered successfully', userId: id });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user: any = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    next(error);
  }
});

export default router;
