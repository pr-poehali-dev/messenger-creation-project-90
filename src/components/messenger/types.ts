export type Tab = "chats" | "contacts" | "search" | "notifications" | "profile" | "settings";
export type CallType = "voice" | "video" | null;

export interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read?: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  typing?: boolean;
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online?: boolean;
}

export interface NotificationItem {
  id: number;
  icon: string;
  text: string;
  time: string;
  read?: boolean;
  color: string;
}

export const chats: Chat[] = [
  { id: 1, name: "Алина Воронова", avatar: "АВ", lastMessage: "Ок, увидимся в 7 😊", time: "14:32", unread: 3, online: true },
  { id: 2, name: "Команда Design", avatar: "КД", lastMessage: "Максим: новые макеты готовы!", time: "13:15", unread: 12, online: false },
  { id: 3, name: "Игорь Смирнов", avatar: "ИС", lastMessage: "Позвони, когда освободишься", time: "12:00", online: true, typing: true },
  { id: 4, name: "Мария Козлова", avatar: "МК", lastMessage: "Спасибо за помощь!", time: "Вчера", online: false },
  { id: 5, name: "Дмитрий Петров", avatar: "ДП", lastMessage: "Встреча перенесена на пятницу", time: "Вчера", unread: 1, online: true },
  { id: 6, name: "Анна Белова", avatar: "АБ", lastMessage: "📎 Документ.pdf", time: "Пн", online: false },
  { id: 7, name: "Алексей Новиков", avatar: "АН", lastMessage: "Хорошо, договорились", time: "Пн", online: true },
];

export const messagesMap: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Привет! Как дела?", out: false, time: "14:20" },
    { id: 2, text: "Всё отлично, спасибо! Работаю над новым проектом 🚀", out: true, time: "14:21", read: true },
    { id: 3, text: "О, интересно! Расскажи подробнее", out: false, time: "14:22" },
    { id: 4, text: "Это мессенджер с видеозвонками. Красивый дизайн и удобный интерфейс!", out: true, time: "14:25", read: true },
    { id: 5, text: "Звучит классно! Когда покажешь?", out: false, time: "14:28" },
    { id: 6, text: "Уже скоро 😉", out: true, time: "14:29", read: true },
    { id: 7, text: "Ок, увидимся в 7 😊", out: false, time: "14:32" },
  ],
  3: [
    { id: 1, text: "Игорь, добрый день!", out: true, time: "11:50", read: true },
    { id: 2, text: "Привет! Есть минута?", out: false, time: "11:55" },
    { id: 3, text: "Позвони, когда освободишься", out: false, time: "12:00" },
  ],
};

export const contacts: Contact[] = [
  { id: 1, name: "Алексей Новиков", avatar: "АН", status: "На связи", online: true },
  { id: 2, name: "Алина Воронова", avatar: "АВ", status: "Онлайн", online: true },
  { id: 3, name: "Анна Белова", avatar: "АБ", status: "Была час назад", online: false },
  { id: 4, name: "Дмитрий Петров", avatar: "ДП", status: "Онлайн", online: true },
  { id: 5, name: "Игорь Смирнов", avatar: "ИС", status: "Онлайн", online: true },
  { id: 6, name: "Мария Козлова", avatar: "МК", status: "Была вчера", online: false },
  { id: 7, name: "Максим Орлов", avatar: "МО", status: "Был 3 часа назад", online: false },
  { id: 8, name: "Наталья Рябова", avatar: "НР", status: "Онлайн", online: true },
];

export const initialNotifications: NotificationItem[] = [
  { id: 1, icon: "MessageCircle", text: "Алина Воронова написала вам сообщение", time: "2 мин назад", color: "#a855f7" },
  { id: 2, icon: "Phone", text: "Пропущенный звонок от Игоря Смирнова", time: "15 мин назад", read: false, color: "#ec4899" },
  { id: 3, icon: "UserPlus", text: "Дмитрий Петров добавил вас в контакты", time: "1 час назад", color: "#3b82f6" },
  { id: 4, icon: "Video", text: "Входящий видеозвонок от Команды Design", time: "3 часа назад", read: true, color: "#06b6d4" },
  { id: 5, icon: "Bell", text: "Напоминание: встреча в 18:00", time: "Вчера", read: true, color: "#f59e0b" },
  { id: 6, icon: "MessageCircle", text: "Максим Орлов упомянул вас в чате", time: "Вчера", read: true, color: "#a855f7" },
];
