import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { invites, users } from "../db/schema";

export class InviteError extends Error {}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Maintainer-only: mint a single-use invite. Returns the raw token (only its hash is stored). */
export async function mintInvite(
  email: string,
  displayName?: string,
  ttlDays = 7,
): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  await db.insert(invites).values({
    email,
    displayName: displayName ?? null,
    tokenHash: hashToken(token),
    expiresAt,
  });
  return token;
}

/** Redeem an invite: validate, create/find the user, mark used. Issuing the invite is the gate. */
export async function redeemInvite(token: string): Promise<{ userId: string }> {
  const tokenHash = hashToken(token);
  const [invite] = await db.select().from(invites).where(eq(invites.tokenHash, tokenHash)).limit(1);
  if (!invite) throw new InviteError("Недействительный инвайт-токен.");
  if (invite.redeemedAt) throw new InviteError("Инвайт уже использован.");
  if (invite.expiresAt.getTime() < Date.now())
    throw new InviteError("Срок действия инвайта истёк.");

  const existing = await db.select().from(users).where(eq(users.email, invite.email)).limit(1);
  let userId = existing[0]?.id;
  if (!userId) {
    const inserted = await db
      .insert(users)
      .values({ email: invite.email, displayName: invite.displayName })
      .returning({ id: users.id });
    const row = inserted[0];
    if (!row) throw new InviteError("Не удалось создать пользователя.");
    userId = row.id;
  }

  await db
    .update(invites)
    .set({ redeemedAt: new Date(), createdUserId: userId })
    .where(eq(invites.id, invite.id));

  return { userId };
}
