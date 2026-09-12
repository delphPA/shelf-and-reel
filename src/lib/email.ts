import "server-only";
import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendNewRecommendationEmails({
  recipients,
  actorName,
  bubbleName,
  itemTitle,
  itemType,
  itemUrl,
}: {
  recipients: string[];
  actorName: string;
  bubbleName: string;
  itemTitle: string;
  itemType: "BOOK" | "MOVIE";
  itemUrl: string;
}) {
  if (recipients.length === 0) return;

  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY is not set — skipping new-recommendation email notifications.");
    return;
  }

  const emoji = itemType === "BOOK" ? "📖" : "🎬";
  const subject = `${emoji} New recommendation in ${bubbleName}`;
  const html = `
    <div style="font-family: -apple-system, sans-serif; color: #3b2a20; max-width: 480px;">
      <p style="font-size: 16px;">
        <strong>${escapeHtml(actorName)}</strong> just added
        <strong>${escapeHtml(itemTitle)}</strong> to <strong>${escapeHtml(bubbleName)}</strong>
        on Shelf &amp; Reel.
      </p>
      <p>
        <a href="${itemUrl}" style="display: inline-block; background: #92400e; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
          Take a look
        </a>
      </p>
      <p style="font-size: 12px; color: #78716c;">
        You're getting this because notifications are on for this bubble — you can turn them off
        from the bubble page any time.
      </p>
    </div>
  `;

  // Sent one at a time (not one call with all recipients) so family members
  // don't see each other's email addresses in the message headers.
  await Promise.allSettled(
    recipients.map((to) =>
      resend.emails.send({
        from: "Shelf & Reel <onboarding@resend.dev>",
        to,
        subject,
        html,
      })
    )
  ).then((results) => {
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Failed to send new-recommendation email", result.reason);
      }
    }
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
