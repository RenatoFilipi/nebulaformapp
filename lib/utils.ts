import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
