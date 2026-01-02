import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => err.msg)
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {

      return res.status(401).json({ errors: ['Invalid credentials'] });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ errors: ['Invalid credentials'] });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch {
    res.status(500).json({ errors: ['Server error'] });
  }
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => err.msg)
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });



    if (existingUser) {
      
      return res.status(400).json({ errors: ['Email already registered'] });
    }

    

    const hashedPassword = await bcrypt.hash(password, 10);
    

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });
    
  
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    
    
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ errors: ['Email already exists'] });
    }
    res.status(500).json({ errors: ['Server error'] });
  }
};
