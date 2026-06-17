import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AdminRepository } from '../../../../lib/db';
import { signToken } from '../../../../lib/auth';

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    const user = await AdminRepository.findByUsername(username);
    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Internal server error during login.' }, { status: 500 });
  }
}
