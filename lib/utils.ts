import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Hàm format ngày hiển thị (Input -> UI)
// Biến "2024-01-25" -> "25/01/2024"
export function formatDateDisplay(isoDateStr: string): string {
  if (!isoDateStr) return "";
  try {
    const [year, month, day] = isoDateStr.split("-");
    if (!year || !month || !day) return isoDateStr;
    return `${day}/${month}/${year}`;
  } catch (e) {
    return isoDateStr;
  }
}

// Hàm format ngày gửi API (UI -> API)
// Biến "25/01/2024" -> "2024-01-25"
export function formatDateApi(displayDateStr: string): string {
  if (!displayDateStr) return "";
  try {
    // Nếu người dùng nhập dạng dd/mm/yyyy
    if (displayDateStr.includes("/")) {
      const [day, month, year] = displayDateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    return displayDateStr;
  } catch (e) {
    return displayDateStr;
  }
}

// Lấy ngày hôm nay format chuẩn VN
export function getTodayDisplay(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}