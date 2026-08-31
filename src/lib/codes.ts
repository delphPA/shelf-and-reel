import { customAlphabet } from "nanoid";

// No ambiguous characters (0/O, 1/I/L) so invite codes are easy to read/type aloud.
export const generateInviteCode = customAlphabet("ABCDEFGHJKMNPQRSTUVWXYZ23456789", 8);
