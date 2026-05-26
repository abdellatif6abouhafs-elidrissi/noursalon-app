import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, createToken, verifyPassword, verifyToken, getTokenFromHeader } from '@/lib/auth-server';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const path = params.slug?.join('/') || '';

    // Debug endpoint
    if (path === 'debug') {
      return NextResponse.json({ slug: params.slug, path });
    }

    if (path === 'health') {
      return NextResponse.json({ status: 'ok' });
    }

  if (path === 'auth/me') {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ detail: 'Invalid token' }, { status: 401 });

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.sub) });
    if (!user) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      salonName: user.salonName || '',
    });
  }

  if (path.startsWith('clients')) {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const clients = await db.collection('clients').find({}).toArray();

    return NextResponse.json(clients.map((c: any) => ({
      id: c._id.toString(),
      ...c,
      _id: undefined,
    })));
  }

  if (path.startsWith('staff')) {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const staff = await db.collection('staff').find({}).toArray();

    return NextResponse.json(staff.map((s: any) => ({
      id: s._id.toString(),
      ...s,
      _id: undefined,
    })));
  }

  if (path.startsWith('appointments')) {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const appointments = await db.collection('appointments').find({}).toArray();

    return NextResponse.json(appointments.map((a: any) => ({
      id: a._id.toString(),
      ...a,
      _id: undefined,
    })));
  }

  return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ detail: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const path = params.slug?.join('/') || '';

    if (path === 'auth/register') {
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
  }

  if (path === 'auth/login') {
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
  }

  if (path === 'clients') {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { db } = await connectToDatabase();
    const result = await db.collection('clients').insertOne({
      ...data,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...data,
    }, { status: 201 });
  }

  if (path === 'staff') {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { db } = await connectToDatabase();
    const result = await db.collection('staff').insertOne({
      ...data,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...data,
    }, { status: 201 });
  }

  if (path === 'appointments') {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    try {
      const data = await request.json();
      const { db } = await connectToDatabase();
      const result = await db.collection('appointments').insertOne({
        ...data,
        createdAt: new Date(),
      });

      return NextResponse.json({
        id: result.insertedId.toString(),
        ...data,
      }, { status: 201 });
    } catch (appointmentError: any) {
      console.error('Appointments error:', appointmentError);
      return NextResponse.json({
        detail: `Failed to create appointment: ${appointmentError.message}`
      }, { status: 500 });
    }
  }

  return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ detail: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const path = params.slug?.join('/') || '';

    if (path.startsWith('appointments/')) {
      const authHeader = request.headers.get('authorization');
      const token = getTokenFromHeader(authHeader);
      if (!token || !verifyToken(token)) {
        return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
      }

      const id = path.split('/')[1];
      if (!id) {
        return NextResponse.json({ detail: 'Missing appointment ID' }, { status: 400 });
      }

      try {
        const { db } = await connectToDatabase();
        const result = await db.collection('appointments').deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return NextResponse.json({ detail: 'Appointment not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
      } catch (appointmentError: any) {
        console.error('Delete appointment error:', appointmentError);
        return NextResponse.json({
          detail: `Failed to delete appointment: ${appointmentError.message}`
        }, { status: 500 });
      }
    }

    return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ detail: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const path = params.slug?.join('/') || '';

    if (path.startsWith('appointments/')) {
      const authHeader = request.headers.get('authorization');
      const token = getTokenFromHeader(authHeader);
      if (!token || !verifyToken(token)) {
        return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
      }

      const id = path.split('/')[1];
      if (!id) {
        return NextResponse.json({ detail: 'Missing appointment ID' }, { status: 400 });
      }

      try {
        const data = await request.json();
        const { db } = await connectToDatabase();
        const result = await db.collection('appointments').updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...data, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
          return NextResponse.json({ detail: 'Appointment not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, ...data }, { status: 200 });
      } catch (appointmentError: any) {
        console.error('Update appointment error:', appointmentError);
        return NextResponse.json({
          detail: `Failed to update appointment: ${appointmentError.message}`
        }, { status: 500 });
      }
    }

    return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ detail: error.message || 'Internal server error' }, { status: 500 });
  }
}
