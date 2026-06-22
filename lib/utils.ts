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

// Hàm format ngày sinh chuẩn YYYY-MM-DD (dùng chung cho các API bói)
export function formatBirthDate(dateInput: any): string {
  if (!dateInput) return '';
  const dateStr = String(dateInput).trim();
  
  // Nếu đã ở dạng YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Nếu ở dạng dd/mm/yyyy
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }

  // Parse thông thường bằng Date object
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    console.error('Error parsing birth date:', dateInput, e);
  }

  return dateStr;
}

// Hàm parse kết quả AI trả về từ nhiều lớp hoặc định dạng Lambda Proxy
export function parseAIResponse(data: any): string {
  if (!data) return '';
  
  try {
    // 1. Nếu là string trực tiếp
    if (typeof data === 'string') return data;

    // 2. Nếu chứa trường analysis
    if (data.analysis) {
      if (typeof data.analysis === 'object') {
        const analysis = data.analysis;
        if (analysis.body) {
          const bodyData = typeof analysis.body === 'string' ? JSON.parse(analysis.body) : analysis.body;
          return bodyData.answer?.analysis || bodyData.answer || bodyData.reply || bodyData.analysis || bodyData.message || JSON.stringify(bodyData, null, 2);
        }
        return analysis.data || analysis.message || analysis.reply || analysis.answer || JSON.stringify(analysis, null, 2);
      }
      return data.analysis;
    }

    // 3. Nếu chứa trường data
    if (data.data) {
      if (typeof data.data === 'string') return data.data;
      if (typeof data.data === 'object') {
        const innerData = data.data;
        return innerData.reply || innerData.answer || innerData.message || innerData.analysis || JSON.stringify(innerData, null, 2);
      }
    }

    // 4. Nếu chứa body (Lambda format trực tiếp)
    if (data.body) {
      const bodyData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      return bodyData.answer?.analysis || bodyData.answer || bodyData.reply || bodyData.message || bodyData.analysis || JSON.stringify(bodyData, null, 2);
    }

    // 5. Các trường fallback thông dụng
    return data.reply || data.answer || data.message || JSON.stringify(data, null, 2);
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    return typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
  }
}