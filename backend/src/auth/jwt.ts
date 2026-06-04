import { jwtVerify, SignJWT } from "jose";
import { env } from "../env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signSession(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_TTL)
    .sign(secret);
}

export async function verifySession(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  if (typeof payload.sub !== "string") throw new Error("invalid token: missing subject");
  return payload.sub;
}
