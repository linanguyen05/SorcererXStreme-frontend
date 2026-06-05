'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type View,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  ArrowLeft, CalendarClock, Save, Trash2, Info, Clock, User as UserIcon,
  Sparkles, CheckCircle2, CreditCard, XCircle, MousePointerClick,
} from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// CSS gốc của thư viện + addon kéo/thả + override dark theme
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar-dark.css';

// ──────────────────────────────────────────────────────────
// Localizer (date-fns, tiếng Việt)
// ──────────────────────────────────────────────────────────
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Tuần bắt đầu từ Thứ 2
  getDay,
  locales: { vi },
});

const DnDCalendar = withDragAndDrop(Calendar as any) as any;

const AVAILABILITY_STORAGE_KEY = 'expert-availability';

// ──────────────────────────────────────────────────────────
// Types & cấu hình trạng thái
// ──────────────────────────────────────────────────────────
type AppointmentStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'availability' | 'appointment';
  status?: AppointmentStatus;
  customer?: string;
  service?: string;
}

const STATUS_CONFIG: Record<AppointmentStatus, {
  label: string;
  hex: string;          // màu nền event trên lịch
  dot: string;          // chấm tròn trong danh sách
  badge: string;        // badge trạng thái
  icon: React.ElementType;
}> = {
  PENDING: {
    label: 'Chờ thanh toán',
    hex: '#c2a35c',
    dot: 'bg-amber-400/80',
    badge: 'bg-amber-400/10 text-amber-300 border-amber-400/25',
    icon: Clock,
  },
  PAID: {
    label: 'Đã thanh toán',
    hex: '#5e8bc4',
    dot: 'bg-sky-400/80',
    badge: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
    icon: CreditCard,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    hex: '#5fa57f',
    dot: 'bg-emerald-400/80',
    badge: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Đã hủy',
    hex: '#828a99',
    dot: 'bg-slate-400/80',
    badge: 'bg-slate-400/10 text-slate-300 border-slate-400/25',
    icon: XCircle,
  },
};

const AVAILABILITY_HEX = '#7d83c4'; // tím lavender dịu cho khung giờ rảnh

// ──────────────────────────────────────────────────────────
// Dữ liệu lịch hẹn mẫu (giả lập "server"), tính tương đối theo hôm nay
// ──────────────────────────────────────────────────────────
function atOffset(dayOffset: number, hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function buildSeedAppointments(): CalendarEvent[] {
  return [
    {
      id: 'apt-1', type: 'appointment', status: 'COMPLETED',
      customer: 'Nguyễn Văn A', service: 'Trải bài Tarot định hướng sự nghiệp',
      title: 'Nguyễn Văn A · Tarot',
      start: atOffset(-1, 14, 0), end: atOffset(-1, 14, 30),
    },
    {
      id: 'apt-2', type: 'appointment', status: 'PAID',
      customer: 'Trần Thị B', service: 'Phân tích bản đồ sao cá nhân',
      title: 'Trần Thị B · Bản đồ sao',
      start: atOffset(1, 10, 0), end: atOffset(1, 11, 0),
    },
    {
      id: 'apt-3', type: 'appointment', status: 'PENDING',
      customer: 'Lê Hoàng C', service: 'Trải bài Tarot tình duyên',
      title: 'Lê Hoàng C · Tarot',
      start: atOffset(1, 16, 0), end: atOffset(1, 16, 45),
    },
    {
      id: 'apt-4', type: 'appointment', status: 'PAID',
      customer: 'Phạm Thu D', service: 'Tư vấn thần số học',
      title: 'Phạm Thu D · Thần số học',
      start: atOffset(3, 9, 30), end: atOffset(3, 10, 15),
    },
    {
      id: 'apt-5', type: 'appointment', status: 'COMPLETED',
      customer: 'Vũ Minh E', service: 'Phân tích bản đồ sao cá nhân',
      title: 'Vũ Minh E · Bản đồ sao',
      start: atOffset(4, 20, 0), end: atOffset(4, 21, 0),
    },
    {
      id: 'apt-6', type: 'appointment', status: 'CANCELLED',
      customer: 'Đỗ Lan F', service: 'Trải bài Tarot tổng quan',
      title: 'Đỗ Lan F · Tarot',
      start: atOffset(2, 13, 0), end: atOffset(2, 13, 30),
    },
  ];
}

// ──────────────────────────────────────────────────────────
// Helpers localStorage cho availability
// ──────────────────────────────────────────────────────────
function loadAvailability(): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AVAILABILITY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{ id: string; start: string; end: string }>;
    return parsed.map((s) => ({
      id: s.id,
      type: 'availability' as const,
      title: 'Khung giờ rảnh',
      start: new Date(s.start),
      end: new Date(s.end),
    }));
  } catch {
    return [];
  }
}

function persistAvailability(slots: CalendarEvent[]) {
  const payload = slots.map((s) => ({
    id: s.id,
    start: s.start.toISOString(),
    end: s.end.toISOString(),
  }));
  localStorage.setItem(AVAILABILITY_STORAGE_KEY, JSON.stringify(payload));
}

// ──────────────────────────────────────────────────────────
// Trang lịch làm việc của Chuyên gia
// ──────────────────────────────────────────────────────────
export default function ExpertSchedulePage() {
  const isCollapsed = useSidebarCollapsed();
  const [mounted, setMounted] = useState(false);

  const [availability, setAvailability] = useState<CalendarEvent[]>([]);
  const [appointments] = useState<CalendarEvent[]>(() => buildSeedAppointments());
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState<Date>(new Date());
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAvailability(loadAvailability());
  }, []);

  const events = useMemo<CalendarEvent[]>(
    () => [...appointments, ...availability],
    [appointments, availability],
  );

  // Giới hạn khung giờ hiển thị 06:00 → 23:00
  const minTime = useMemo(() => { const d = new Date(); d.setHours(6, 0, 0, 0); return d; }, []);
  const maxTime = useMemo(() => { const d = new Date(); d.setHours(23, 0, 0, 0); return d; }, []);

  // Kéo chọn vùng trống → tạo khung giờ rảnh mới
  const handleSelectSlot = useCallback((slot: { start: Date; end: Date }) => {
    let { start, end } = slot;
    // Click đơn (month view hoặc click 1 ô) → mặc định 1 giờ
    if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }
    const newSlot: CalendarEvent = {
      id: `slot-${Date.now()}`,
      type: 'availability',
      title: 'Khung giờ rảnh',
      start,
      end,
    };
    setAvailability((prev) => [...prev, newSlot]);
    setDirty(true);
    toast.success('Đã thêm khung giờ rảnh. Nhớ bấm "Gửi khung giờ" để lưu.');
  }, []);

  // Kéo/thả di chuyển hoặc thay đổi kích thước
  const handleEventChange = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      if (event.type !== 'availability') {
        toast.error('Không thể chỉnh sửa lịch hẹn của khách trực tiếp trên lịch.');
        return;
      }
      setAvailability((prev) =>
        prev.map((s) => (s.id === event.id ? { ...s, start, end } : s)),
      );
      setDirty(true);
    },
    [],
  );

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (event.type === 'availability') {
      if (window.confirm('Xóa khung giờ rảnh này?')) {
        setAvailability((prev) => prev.filter((s) => s.id !== event.id));
        setDirty(true);
      }
      return;
    }
    const cfg = event.status ? STATUS_CONFIG[event.status] : null;
    toast(
      `${event.customer}\n${event.service}\nTrạng thái: ${cfg?.label ?? ''}`,
      { icon: '🔮', duration: 4000 },
    );
  }, []);

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const hex = event.type === 'availability'
      ? AVAILABILITY_HEX
      : STATUS_CONFIG[event.status ?? 'PENDING'].hex;
    return {
      style: {
        backgroundColor: hex,
        color: '#fff',
        opacity: event.status === 'CANCELLED' ? 0.55 : 1,
        textDecoration: event.status === 'CANCELLED' ? 'line-through' : 'none',
        border: event.type === 'availability' ? '1px dashed rgba(255,255,255,0.55)' : 'none',
      },
    };
  }, []);

  const handleSubmit = useCallback(() => {
    persistAvailability(availability);
    setDirty(false);
    toast.success(`Đã gửi ${availability.length} khung giờ rảnh tới hệ thống.`);
  }, [availability]);

  const handleClearAll = useCallback(() => {
    if (availability.length === 0) return;
    if (window.confirm('Xóa toàn bộ khung giờ rảnh chưa lưu?')) {
      setAvailability([]);
      setDirty(true);
    }
  }, [availability.length]);

  // Lịch hẹn sắp tới (từ hiện tại trở đi), sắp xếp tăng dần
  const upcoming = useMemo(() => {
    const now = Date.now();
    return [...appointments]
      .filter((a) => a.end.getTime() >= now && a.status !== 'CANCELLED')
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [appointments]);

  const messages = useMemo(
    () => ({
      week: 'Tuần', day: 'Ngày', month: 'Tháng', agenda: 'Danh sách',
      today: 'Hôm nay', previous: 'Trước', next: 'Sau',
      date: 'Ngày', time: 'Giờ', event: 'Sự kiện',
      noEventsInRange: 'Không có lịch nào trong khoảng này.',
      showMore: (total: number) => `+ ${total} lịch khác`,
    }),
    [],
  );

  const formats = useMemo(
    () => ({
      timeGutterFormat: 'HH:mm',
      dayFormat: 'EEE dd/MM',
      dayHeaderFormat: 'EEEE, dd/MM/yyyy',
      agendaTimeFormat: 'HH:mm',
      agendaDateFormat: 'EEE dd/MM',
    }),
    [],
  );

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main
        className={cn(
          'flex-1 min-h-screen pt-20 pb-20 px-4 md:px-8 bg-transparent overflow-x-hidden transition-all duration-300',
          isCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]',
        )}
      >
        <div className="max-w-7xl mx-auto space-y-8 relative z-10 font-['Be_Vietnam_Pro']">
          {/* HEADER */}
          <div className="space-y-4 border-b border-white/10 pb-8">
            <Link
              href="/dashboard_expert"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại Workspace
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold font-['Pacifico'] text-white leading-[1.2]">
                  Lịch <span className="text-red-500">làm việc</span>
                </h1>
                <p className="text-gray-400 text-sm uppercase tracking-[0.3em]">
                  Thiết lập khung giờ rảnh &amp; theo dõi lịch hẹn
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleClearAll}
                  className="px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Xóa hết
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  className={cn(
                    'px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-red-500/20',
                    dirty && 'animate-pulse',
                  )}
                >
                  <Save className="w-4 h-4" /> Gửi khung giờ
                  {availability.length > 0 && (
                    <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-md">{availability.length}</span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* HƯỚNG DẪN + CHÚ THÍCH MÀU */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-purple-500/5 border border-purple-500/20 p-5 rounded-2xl flex gap-3">
              <MousePointerClick className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-xs text-purple-100/80 leading-relaxed">
                <strong className="text-purple-300">Kéo &amp; thả để chọn khung giờ rảnh:</strong> nhấn giữ và kéo
                trên lưới thời gian để tạo một khung giờ rảnh mới. Kéo để di chuyển hoặc kéo mép để thay đổi độ dài.
                Bấm vào một khung giờ để xóa. Khi xong, bấm <em>"Gửi khung giờ"</em> để lưu.
              </p>
            </div>
            <div className="bg-gray-900/60 border border-white/10 p-5 rounded-2xl">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-3">Chú thích</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <LegendItem color={AVAILABILITY_HEX} label="Giờ rảnh" dashed />
                {(['PAID', 'COMPLETED', 'PENDING', 'CANCELLED'] as AppointmentStatus[]).map((s) => (
                  <LegendItem key={s} color={STATUS_CONFIG[s].hex} label={STATUS_CONFIG[s].label} />
                ))}
              </div>
            </div>
          </div>

          {/* LỊCH */}
          <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-2xl">
            <div className="expert-calendar" style={{ height: 680 }}>
              {mounted ? (
                <DnDCalendar
                  localizer={localizer}
                  culture="vi"
                  events={events}
                  view={view}
                  onView={(v: View) => setView(v)}
                  date={date}
                  onNavigate={(d: Date) => setDate(d)}
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  defaultView={Views.WEEK}
                  step={30}
                  timeslots={2}
                  min={minTime}
                  max={maxTime}
                  selectable
                  popup
                  resizable
                  messages={messages}
                  formats={formats}
                  startAccessor="start"
                  endAccessor="end"
                  draggableAccessor={(event: CalendarEvent) => event.type === 'availability'}
                  resizableAccessor={(event: CalendarEvent) => event.type === 'availability'}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  onEventDrop={handleEventChange}
                  onEventResize={handleEventChange}
                  eventPropGetter={eventPropGetter}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  Đang tải lịch…
                </div>
              )}
            </div>
          </section>

          {/* DANH SÁCH LỊCH HẸN SẮP TỚI */}
          <section className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <CalendarClock className="w-6 h-6 text-red-500" /> Lịch hẹn sắp tới
              </h2>
              <span className="text-xs text-gray-500 font-medium">{upcoming.length} lịch hẹn</span>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-gray-500 text-sm italic">Chưa có lịch hẹn nào sắp tới.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} apt={apt} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────
function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-4 h-4 rounded-md shrink-0"
        style={{
          backgroundColor: color,
          border: dashed ? '1px dashed rgba(255,255,255,0.6)' : 'none',
        }}
      />
      <span className="text-xs text-gray-300 font-medium">{label}</span>
    </div>
  );
}

function AppointmentCard({ apt }: { apt: CalendarEvent }) {
  const cfg = STATUS_CONFIG[apt.status ?? 'PENDING'];
  const StatusIcon = cfg.icon;
  return (
    <div
      className="group flex items-center gap-4 bg-black/40 border border-white/5 rounded-2xl p-4 hover:border-white/15 transition-all"
      style={{ borderLeft: `4px solid ${cfg.hex}` }}
    >
      {/* Chấm trạng thái */}
      <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', cfg.dot)} />

      {/* Thông tin khách + dịch vụ */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm flex items-center gap-2">
          <UserIcon className="w-3.5 h-3.5 text-gray-500" /> {apt.customer}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-2 mt-1 truncate">
          <Sparkles className="w-3 h-3 text-red-400 shrink-0" /> {apt.service}
        </p>
      </div>

      {/* Thời gian */}
      <div className="hidden sm:block text-right shrink-0">
        <p className="text-xs font-bold text-white">
          {format(apt.start, 'HH:mm', { locale: vi })} – {format(apt.end, 'HH:mm', { locale: vi })}
        </p>
        <p className="text-[11px] text-gray-500 capitalize">
          {format(apt.start, 'EEEE, dd/MM/yyyy', { locale: vi })}
        </p>
      </div>

      {/* Badge trạng thái */}
      <span
        className={cn(
          'shrink-0 inline-flex items-center gap-1.5 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border',
          cfg.badge,
        )}
      >
        <StatusIcon className="w-3 h-3" /> {cfg.label}
      </span>
    </div>
  );
}
