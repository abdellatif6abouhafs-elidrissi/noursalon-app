import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.SECRET_KEY || 'dev-secret-key-change-in-production-min-32-chars';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(userId: string, email: string): string {
  return jwt.sign(
    { sub: userId, email },
    SECRET_KEY,
    { expiresIn: '168h' }
  );
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { sub: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}
