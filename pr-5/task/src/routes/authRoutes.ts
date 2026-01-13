import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/authValidator';

const router = Router();

// Registration
router.post('/register', async (req: Request, res: Response) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, surname, email, password, roleId } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ error: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, surname, email, password: hashedPassword, roleId });
  const token = generateToken({ id: user.id, email: user.email, roleId: user.roleId });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

  const token = generateToken({ id: user.id, email: user.email, roleId: user.roleId });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
