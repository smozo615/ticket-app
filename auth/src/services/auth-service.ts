import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../utils/password';
import { User } from '../models/user';

interface reqData {
  email: string;
  password: string;
}

export class AuthService {
  static async register({ email, password }: reqData) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    const token = await this.signToken(user.id, user.email);
    return token;
  }

  static async login({ email, password }: reqData) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const match = await Password.compare(user.password, password);
    if (!match) {
      throw new BadRequestError('Invalid credentials');
    }

    const token = await this.signToken(user.id, user.email);
    return token;
  }

  private static async signToken(id: string, email: string) {
    const payload = {
      id,
      email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);
    return token;
  }
}
