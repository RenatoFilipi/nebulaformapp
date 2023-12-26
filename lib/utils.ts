import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance, formatRelative, subDays, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mailMasker(email: string): string {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart =
    localPart.length > 2
      ? localPart[0] + "*".repeat(localPart.length - 2) + localPart[localPart.length - 1]
      : localPart;
  const maskedEmail = `${maskedLocalPart}@${domain}`;

  return maskedEmail;
}

export function parseFormatDistanceDate(date: string, referenceDate: Date = new Date()): string | null {
  const parsedDate = parseISO(date);
  if (isNaN(parsedDate.getTime())) {
    return null;
  }
  const distance = formatDistance(parsedDate, referenceDate, { addSuffix: true });
  return distance;
}
