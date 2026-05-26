import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const client = await db.collection('clients').findOne({
      _id: new ObjectId(params.id),
    });

    if (!client) {
      return NextResponse.json({ detail: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: client._id.toString(),
      ...client,
      _id: undefined,
    });
  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('clients').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: data },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({ detail: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: result.value._id.toString(),
      ...result.value,
      _id: undefined,
    });
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('clients').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ detail: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
