import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function calculateDaysRemaining(expirationDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiryDateOnly = new Date(expirationDate);
  expiryDateOnly.setHours(0, 0, 0, 0);
  
  const diffInMs = expiryDateOnly.getTime() - today.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

export function getExpirationStatusColor(daysRemaining: number): string {
  if (daysRemaining < 0) return "text-red-600";
  if (daysRemaining <= 30) return "text-amber-600";
  return "text-green-600";
}

export function getExpirationStatus(daysRemaining: number): string {
  if (daysRemaining < 0) return `Expirado há ${Math.abs(daysRemaining)} dias`;
  if (daysRemaining === 0) return "Expira hoje";
  return `Válido por mais ${daysRemaining} dias`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export const certificateTypes = [
  "SSL/TLS",
  "Assinatura Digital",
  "Autenticação de Cliente",
  "CA Intermediária",
  "Outro",
];

export const certificateStatuses = [
  { value: "active", label: "Ativo", color: "green" },
  { value: "expired", label: "Expirado", color: "red" },
  { value: "revoked", label: "Revogado", color: "red" },
  { value: "pending", label: "Pendente", color: "amber" },
];
