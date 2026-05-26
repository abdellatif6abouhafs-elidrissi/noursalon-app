import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'dev-secret-key-change-in-production-min-32-chars';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { detail: 'Email and password required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { detail: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      SECRET_KEY,
      { expiresIn: '168h' }
    );

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
