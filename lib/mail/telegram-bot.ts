/**
 * Telegram Bot helper for sending replies.
 */

const TELEGRAM_API = "https://api.telegram.org/bot";

export function getTelegramBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN || null;
}

export async function sendTelegramMessage(chatId: string | number, text: string): Promise<void> {
  const token = getTelegramBotToken();
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${error}`);
  }
}

export function verifyTelegramSignature(
  token: string,
  rawBody: string,
  signature: string
): boolean {
  const secret = token.split(":")[1];
  if (!secret) return false;

  const hmac = require("crypto")
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return hmac === signature;
}
