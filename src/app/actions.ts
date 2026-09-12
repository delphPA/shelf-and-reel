"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser, requireUser, setSession, clearSession } from "@/lib/auth";
import { generateInviteCode } from "@/lib/codes";
import { sendNewRecommendationEmails } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import { hashPassword, verifyPassword } from "@/lib/password";

const MAX_COVER_BYTES = 5 * 1024 * 1024;

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function resolveCoverUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("coverImage");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_COVER_BYTES) {
      throw new Error("That image is too large — please use one under 5MB.");
    }
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const blob = await put(`covers/${randomUUID()}.${ext || "jpg"}`, file, {
      access: "public",
    });
    return blob.url;
  }
  return str(formData, "coverUrl") || null;
}

async function getOrCreateUserFromForm(formData: FormData) {
  let user = await getCurrentUser();
  let isNew = false;
  if (!user) {
    const displayName = str(formData, "displayName");
    const avatarEmoji = str(formData, "avatarEmoji") || "🙂";
    const email = str(formData, "signupEmail") || null;
    const password = str(formData, "signupPassword");

    if (!displayName) {
      throw new Error("Please enter your name to continue.");
    }
    if (email && password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new Error(
          "That email already has an account here — sign in instead, then create or join from your profile."
        );
      }
    }

    const passwordHash = email && password ? await hashPassword(password) : null;

    user = await prisma.user.create({
      data: { name: displayName, avatarEmoji, email, passwordHash },
    });
    await setSession(user.id);
    isNew = true;
  }
  return { user, isNew };
}

export async function createBubbleAction(formData: FormData) {
  const name = str(formData, "name");
  const description = str(formData, "description") || null;
  const visibility = formData.get("visibility") === "PUBLIC" ? "PUBLIC" : "PRIVATE";

  if (!name) throw new Error("Please give your bubble a name.");

  const { user, isNew } = await getOrCreateUserFromForm(formData);

  const bubble = await prisma.bubble.create({
    data: {
      name,
      description,
      visibility,
      inviteCode: generateInviteCode(),
      ownerId: user.id,
      memberships: { create: { userId: user.id, role: "OWNER" } },
    },
  });

  redirect(`/bubble/${bubble.id}${isNew ? "?welcome=1" : ""}`);
}

export async function joinBubbleAction(formData: FormData) {
  const inviteCode = str(formData, "inviteCode");
  const bubble = await prisma.bubble.findUnique({ where: { inviteCode } });
  if (!bubble) throw new Error("That invite link doesn't seem to be valid anymore.");

  const { user, isNew } = await getOrCreateUserFromForm(formData);

  await prisma.membership.upsert({
    where: { userId_bubbleId: { userId: user.id, bubbleId: bubble.id } },
    update: {},
    create: { userId: user.id, bubbleId: bubble.id, role: "MEMBER" },
  });

  redirect(`/bubble/${bubble.id}${isNew ? "?welcome=1" : ""}`);
}

export async function addRecommendationAction(formData: FormData) {
  const user = await requireUser();
  const bubbleId = str(formData, "bubbleId");

  const membership = await prisma.membership.findUnique({
    where: { userId_bubbleId: { userId: user.id, bubbleId } },
  });
  if (!membership) throw new Error("Join this bubble before adding a recommendation.");

  const type = formData.get("type") === "MOVIE" ? "MOVIE" : "BOOK";
  const title = str(formData, "title");
  const creator = str(formData, "creator") || null;
  const genre = str(formData, "genre") || "Other";
  const ageSection = ["KIDS", "TEEN", "ADULT"].includes(str(formData, "ageSection"))
    ? str(formData, "ageSection")
    : "ADULT";
  const description = str(formData, "description") || null;
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating")) || 5));
  const text = str(formData, "text") || null;

  if (!title) throw new Error("A title is required.");

  const coverUrl = await resolveCoverUrl(formData);

  const candidates = await prisma.item.findMany({ where: { type } });
  let item = candidates.find((c) => c.title.toLowerCase() === title.toLowerCase());

  if (!item) {
    item = await prisma.item.create({
      data: { type, title, creator, genre, ageSection, description, coverUrl, addedById: user.id },
    });
  }

  const existingReview = await prisma.review.findUnique({
    where: { itemId_userId_bubbleId: { itemId: item.id, userId: user.id, bubbleId } },
  });

  await prisma.review.upsert({
    where: { itemId_userId_bubbleId: { itemId: item.id, userId: user.id, bubbleId } },
    update: { rating, text },
    create: { itemId: item.id, userId: user.id, bubbleId, rating, text },
  });

  if (!existingReview) {
    const notifyMembers = await prisma.membership.findMany({
      where: { bubbleId, userId: { not: user.id }, notifyOnNewItem: true },
      include: { user: { select: { email: true } } },
    });
    const recipients = notifyMembers
      .map((m) => m.user.email)
      .filter((email): email is string => Boolean(email));

    if (recipients.length > 0) {
      const bubbleForEmail = await prisma.bubble.findUnique({
        where: { id: bubbleId },
        select: { name: true },
      });
      await sendNewRecommendationEmails({
        recipients,
        actorName: user.name,
        bubbleName: bubbleForEmail?.name ?? "your bubble",
        itemTitle: item.title,
        itemType: item.type as "BOOK" | "MOVIE",
        itemUrl: `${getSiteUrl()}/item/${item.id}?bubble=${bubbleId}`,
      });
    }
  }

  revalidatePath(`/bubble/${bubbleId}`);
  redirect(`/item/${item.id}?bubble=${bubbleId}`);
}

export async function addReviewAction(formData: FormData) {
  const user = await requireUser();
  const itemId = str(formData, "itemId");
  const bubbleId = str(formData, "bubbleId");

  const membership = await prisma.membership.findUnique({
    where: { userId_bubbleId: { userId: user.id, bubbleId } },
  });
  if (!membership) throw new Error("Join this bubble before reviewing here.");

  const rating = Math.min(5, Math.max(1, Number(formData.get("rating")) || 5));
  const text = str(formData, "text") || null;

  await prisma.review.upsert({
    where: { itemId_userId_bubbleId: { itemId, userId: user.id, bubbleId } },
    update: { rating, text },
    create: { itemId, userId: user.id, bubbleId, rating, text },
  });

  revalidatePath(`/item/${itemId}`);
}

export async function updateItemAction(formData: FormData) {
  const user = await requireUser();
  const itemId = str(formData, "itemId");

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) throw new Error("This item no longer exists.");
  if (item.addedById !== user.id) {
    throw new Error("Only the person who added this can edit its details.");
  }

  const title = str(formData, "title");
  const creator = str(formData, "creator") || null;
  const genre = str(formData, "genre") || item.genre;
  const ageSection = ["KIDS", "TEEN", "ADULT"].includes(str(formData, "ageSection"))
    ? str(formData, "ageSection")
    : item.ageSection;
  const description = str(formData, "description") || null;

  if (!title) throw new Error("A title is required.");

  const coverUrl = await resolveCoverUrl(formData);

  await prisma.item.update({
    where: { id: itemId },
    data: { title, creator, genre, ageSection, description, coverUrl },
  });

  revalidatePath(`/item/${itemId}`);
}

export async function deleteItemAction(formData: FormData) {
  const user = await requireUser();
  const itemId = str(formData, "itemId");
  const bubbleId = str(formData, "bubbleId");

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) redirect(bubbleId ? `/bubble/${bubbleId}` : "/");
  if (item.addedById !== user.id) {
    throw new Error("Only the person who added this can delete it.");
  }

  await prisma.$transaction([
    prisma.review.deleteMany({ where: { itemId } }),
    prisma.item.delete({ where: { id: itemId } }),
  ]);

  if (bubbleId) {
    revalidatePath(`/bubble/${bubbleId}`);
    redirect(`/bubble/${bubbleId}`);
  }
  redirect("/");
}

export async function updateNotificationPrefAction(formData: FormData) {
  const user = await requireUser();
  const bubbleId = str(formData, "bubbleId");
  const notify = formData.get("notify") === "on";

  await prisma.membership.update({
    where: { userId_bubbleId: { userId: user.id, bubbleId } },
    data: { notifyOnNewItem: notify },
  });

  revalidatePath(`/bubble/${bubbleId}`);
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const name = str(formData, "name");
  const avatarEmoji = str(formData, "avatarEmoji") || user.avatarEmoji;
  const email = str(formData, "email") || null;

  if (!name) throw new Error("Name can't be empty.");

  try {
    await prisma.user.update({ where: { id: user.id }, data: { name, avatarEmoji, email } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("That email is already used by another account.");
    }
    throw err;
  }
  revalidatePath("/me");
}

export async function setPasswordAction(formData: FormData) {
  const user = await requireUser();
  const newPassword = str(formData, "newPassword");
  const currentPassword = str(formData, "currentPassword");

  if (!user.email) {
    throw new Error("Add an email to your profile first, then you can set a password.");
  }
  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (user.passwordHash) {
    const ok = currentPassword && (await verifyPassword(currentPassword, user.passwordHash));
    if (!ok) throw new Error("Your current password wasn't correct.");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  revalidatePath("/me");
}

export async function loginWithPasswordAction(formData: FormData) {
  const email = str(formData, "email");
  const password = str(formData, "password");

  if (!email || !password) {
    throw new Error("Please enter your email and password.");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    throw new Error("That email and password don't match an account.");
  }

  await setSession(user.id);
  redirect("/me");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
