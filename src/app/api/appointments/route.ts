import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { detail: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');
    const appointments = await appointmentsCollection.find({}).toArray();

    return NextResponse.json(appointments.map((a: any) => ({
      id: a._id.toString(),
      ...a,
      _id: undefined,
    })));
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { detail: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    const result = await appointmentsCollection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...data,
    }, { status: 201 });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
