import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const clientsCollection = db.collection('clients');
    const clients = await clientsCollection.find({}).toArray();

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { db } = await connectToDatabase();
    const clientsCollection = db.collection('clients');

    const result = await clientsCollection.insertOne(data);

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
