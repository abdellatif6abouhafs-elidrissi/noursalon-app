import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, salonName } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { detail: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { detail: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      salonName: salonName || '',
      createdAt: new Date(),
    });

    const token = createToken(result.insertedId.toString(), email);

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: result.insertedId.toString(),
        email,
        name,
        salonName: salonName || '',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
