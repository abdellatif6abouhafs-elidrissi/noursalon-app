import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyPassword, createToken } from '@/lib/auth';

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

    if (!user || !await verifyPassword(password, user.password)) {
      return NextResponse.json(
        { detail: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createToken(user._id.toString(), email);

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        salonName: user.salonName || '',
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
