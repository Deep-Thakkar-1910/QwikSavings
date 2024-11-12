import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOptions {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTIONS: SignOptions = {
  expiresIn: "1d",
};

export const signJwt = (
  payload: JwtPayload,
  options: SignOptions = DEFAULT_SIGN_OPTIONS,
) => {
  const Secret = process.env.JWT_SECRET!;
  const token = jwt.sign(payload, Secret, options);
  return token;
};

export const verifyJwt = (token: string) => {
  const Secret = process.env.JWT_SECRET!;
  try {
    const decoded = jwt.verify(token, Secret);
    return decoded as JwtPayload;
  } catch (err) {
    console.error(err);
  }
};
