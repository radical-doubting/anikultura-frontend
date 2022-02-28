import { User } from './user.type';

export class LoginBody {
  username: string;
  password: string;
}

export class AuthPayload {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}
