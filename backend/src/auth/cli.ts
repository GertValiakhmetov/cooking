import { env } from "../env";
import { mintInvite } from "./invite";

// Usage: pnpm --filter @cooking/backend invite <email> ["Display Name"]
const [, , email, ...nameParts] = process.argv;
if (!email) {
  console.error('Usage: pnpm --filter @cooking/backend invite <email> ["Display Name"]');
  process.exit(1);
}

const displayName = nameParts.join(" ").trim() || undefined;
const token = await mintInvite(email, displayName);

console.log(`Invite for ${email}:`);
console.log(`${env.PUBLIC_APP_URL}/redeem?token=${token}`);
process.exit(0);
