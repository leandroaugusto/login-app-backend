import { Request, Response, CookieOptions } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import User from '@/models/user';
import { IUser } from '@/models/user/types';

const expiresIn = '1d'
const refreshTokenExpiresIn = '7d'

const getAccessToken = (id: string) =>
  jwt.sign({ id }, 'secretkey', { expiresIn });

const getRefreshToken = (id: string) =>
  jwt.sign({ id }, 'refreshSecretKey', { expiresIn: refreshTokenExpiresIn });

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'PRODUCTION',
  sameSite: 'strict',
  maxAge: ms(refreshTokenExpiresIn)
}

export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Verificar se o username já existe
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('Username already exists');
  }

  // Verificar se o username contém espaços
  if (/\s/.test(username)) {
    return res.status(400).send('Username should not contain spaces');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();

    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
};

export const authenticate = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    if (!user.active) return res.status(400).send('User is not active');

    const token = getAccessToken(user._id as string);
    const refreshToken = getRefreshToken(user._id as string);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.json({ token, expiresIn: ms(expiresIn) });
  } catch (error) {
    console.error(error)
    res.status(400).send('Error logging in');
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refreshToken, 'refreshSecretKey') as { id: string };

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403);

    const token = getAccessToken(user._id as string);
    refreshToken = getRefreshToken(user._id as string);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.json({ token, expiresIn: ms(expiresIn) });
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
};

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find();

    res.json({ users });
  } catch (error) {
    res.status(400).send('Error fetching users');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send('User not found');

    res.json(user);
  } catch (error) {
    res.status(400).send('Error fetching user');
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const { ...fields }: IUser = req.body;

  const updates = Object.keys(req.body);
  const notAllowedFields = ['password'];
  const isValidOperation = updates.every((update) =>
    !notAllowedFields.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...fields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).send('User not found');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).send('Error updating user');
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const { password }: Pick<IUser, 'password'> = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

    res.status(201).send('User password updated');
  } catch (error) {
    res.status(400).send('Error updating user password');
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { active: false });

    res.status(201).send('User deleted');
  } catch (error) {
    res.status(400).send('Error deleting user');
  }
};
