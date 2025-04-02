import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Hoje, ${format(dateObj, "HH:mm", { locale: ptBR })}`;
  } else if (isYesterday(dateObj)) {
    return `Ontem, ${format(dateObj, "HH:mm", { locale: ptBR })}`;
  } else {
    return formatDistanceToNow(dateObj, { locale: ptBR, addSuffix: true });
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "permitido":
      return "bg-green-100 text-green-800";
    case "bloqueado":
      return "bg-red-100 text-red-800";
    case "pendente":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function getIconColor(color: string): string {
  switch (color) {
    case "primary":
      return "bg-blue-100 text-blue-600";
    case "secondary":
      return "bg-green-100 text-green-600";
    case "amber":
      return "bg-amber-100 text-amber-600";
    case "red":
      return "bg-red-100 text-red-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

// Renamed from getTrendIcon to getTrendIconClass to avoid JSX in utils
export function getTrendIcon(direction: string): string {
  switch (direction) {
    case "up":
      return "fa-solid fa-arrow-up mr-1";
    case "down":
      return "fa-solid fa-arrow-down mr-1";
    case "warning":
      return "fa-solid fa-triangle-exclamation mr-1";
    default:
      return "";
  }
}

export function getTrendColor(direction: string): string {
  switch (direction) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    case "warning":
      return "text-amber-600";
    default:
      return "text-slate-600";
  }
}
