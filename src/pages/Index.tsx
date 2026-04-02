import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "chats" | "contacts" | "search" | "notifications" | "profile" | "settings";
type CallType = "voice" | "video" | null;

interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read?: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  typing?: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online?: boolean;
}

interface NotificationItem {
  id: number;
  icon: string;
  text: string;
  time: string;
  read?: boolean;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const chats: Chat[] = [
  { id: 1, name: "Алина Воронова", avatar: "АВ", lastMessage: "Ок, увидимся в 7 😊", time: "14:32", unread: 3, online: true },
  { id: 2, name: "Команда Design", avatar: "КД", lastMessage: "Максим: новые макеты готовы!", time: "13:15", unread: 12, online: false },
  { id: 3, name: "Игорь Смирнов", avatar: "ИС", lastMessage: "Позвони, когда освободишься", time: "12:00", online: true, typing: true },
  { id: 4, name: "Мария Козлова", avatar: "МК", lastMessage: "Спасибо за помощь!", time: "Вчера", online: false },
  { id: 5, name: "Дмитрий Петров", avatar: "ДП", lastMessage: "Встреча перенесена на пятницу", time: "Вчера", unread: 1, online: true },
  { id: 6, name: "Анна Белова", avatar: "АБ", lastMessage: "📎 Документ.pdf", time: "Пн", online: false },
  { id: 7, name: "Алексей Новиков", avatar: "АН", lastMessage: "Хорошо, договорились", time: "Пн", online: true },
];

const messagesMap: Record<number, Message[]> = {
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

const contacts: Contact[] = [
  { id: 1, name: "Алексей Новиков", avatar: "АН", status: "На связи", online: true },
  { id: 2, name: "Алина Воронова", avatar: "АВ", status: "Онлайн", online: true },
  { id: 3, name: "Анна Белова", avatar: "АБ", status: "Была час назад", online: false },
  { id: 4, name: "Дмитрий Петров", avatar: "ДП", status: "Онлайн", online: true },
  { id: 5, name: "Игорь Смирнов", avatar: "ИС", status: "Онлайн", online: true },
  { id: 6, name: "Мария Козлова", avatar: "МК", status: "Была вчера", online: false },
  { id: 7, name: "Максим Орлов", avatar: "МО", status: "Был 3 часа назад", online: false },
  { id: 8, name: "Наталья Рябова", avatar: "НР", status: "Онлайн", online: true },
];

const initialNotifications: NotificationItem[] = [
  { id: 1, icon: "MessageCircle", text: "Алина Воронова написала вам сообщение", time: "2 мин назад", color: "#a855f7" },
  { id: 2, icon: "Phone", text: "Пропущенный звонок от Игоря Смирнова", time: "15 мин назад", read: false, color: "#ec4899" },
  { id: 3, icon: "UserPlus", text: "Дмитрий Петров добавил вас в контакты", time: "1 час назад", color: "#3b82f6" },
  { id: 4, icon: "Video", text: "Входящий видеозвонок от Команды Design", time: "3 часа назад", read: true, color: "#06b6d4" },
  { id: 5, icon: "Bell", text: "Напоминание: встреча в 18:00", time: "Вчера", read: true, color: "#f59e0b" },
  { id: 6, icon: "MessageCircle", text: "Максим Орлов упомянул вас в чате", time: "Вчера", read: true, color: "#a855f7" },
];

// ─── Avatar Component ─────────────────────────────────────────────────────────
const AvatarEl = ({
  letters,
  size = "md",
  online,
  gradient,
}: {
  letters: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  gradient?: string;
}) => {
  const sizes = { sm: "w-9 h-9 text-xs", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" };
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-pink-500 to-orange-400",
    "from-green-400 to-cyan-500",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
  ];
  const g = gradient || gradients[letters.charCodeAt(0) % gradients.length];

  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} bg-gradient-to-br ${g} rounded-full flex items-center justify-center font-bold text-white`}>
        {letters}
      </div>
      {online !== undefined && (
        <div className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[hsl(var(--background))] ${online ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" : "bg-gray-500"}`} />
      )}
    </div>
  );
};

// ─── Call Overlay ─────────────────────────────────────────────────────────────
const CallOverlay = ({
  callType,
  callee,
  onEnd,
}: {
  callType: CallType;
  callee: string;
  onEnd: () => void;
}) => {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in">
      {callType === "video" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
          </div>
          <div className="absolute top-4 right-4 w-28 h-36 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center">
            <Icon name="User" size={32} className="text-white/30" />
          </div>
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="animate-call-pulse">
          <AvatarEl letters={callee.slice(0, 2).toUpperCase()} size="xl" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{callee}</h2>
          <p className="text-white/60 mt-1">{callType === "video" ? "Видеозвонок" : "Голосовой звонок"} • 00:42</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setMuted(!muted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muted ? "bg-white/20 text-white" : "bg-white/10 text-white/70"}`}
          >
            <Icon name={muted ? "MicOff" : "Mic"} size={22} />
          </button>
          {callType === "video" && (
            <button
              onClick={() => setCamOff(!camOff)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${camOff ? "bg-white/20 text-white" : "bg-white/10 text-white/70"}`}
            >
              <Icon name={camOff ? "VideoOff" : "Video"} size={22} />
            </button>
          )}
          <button
            onClick={onEnd}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all neon-glow-pink"
          >
            <Icon name="PhoneOff" size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Chat View ────────────────────────────────────────────────────────────────
const ChatView = ({
  chat,
  onBack,
  onCall,
}: {
  chat: Chat;
  onBack: () => void;
  onCall: (type: "voice" | "video") => void;
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    messagesMap[chat.id] || [{ id: 1, text: `Привет! Это начало чата с ${chat.name}`, out: false, time: "сейчас" }]
  );

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: input,
        out: true,
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="glass-strong px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <AvatarEl letters={chat.avatar} size="sm" online={chat.online} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{chat.name}</p>
          <p className="text-xs text-muted-foreground">
            {chat.typing ? <span className="text-purple-400">печатает...</span> : chat.online ? "онлайн" : "был(а) недавно"}
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onCall("voice")} className="w-9 h-9 rounded-xl glass hover:bg-white/10 flex items-center justify-center transition-all group">
            <Icon name="Phone" size={17} className="text-purple-400 group-hover:text-purple-300" />
          </button>
          <button onClick={() => onCall("video")} className="w-9 h-9 rounded-xl glass hover:bg-white/10 flex items-center justify-center transition-all group">
            <Icon name="Video" size={17} className="text-purple-400 group-hover:text-purple-300" />
          </button>
          <button className="w-9 h-9 rounded-xl glass hover:bg-white/10 flex items-center justify-center transition-all">
            <Icon name="MoreVertical" size={17} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`max-w-[75%] px-4 py-2.5 ${msg.out ? "message-bubble-out text-white" : "message-bubble-in text-foreground"}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.out ? "justify-end" : "justify-start"}`}>
                <span className={`text-[10px] ${msg.out ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</span>
                {msg.out && <Icon name={msg.read ? "CheckCheck" : "Check"} size={12} className={msg.read ? "text-white/80" : "text-white/40"} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4 flex-shrink-0">
        <div className="glass-strong rounded-2xl flex items-center gap-2 px-3 py-2">
          <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-purple-400 transition-colors">
            <Icon name="Paperclip" size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Написать сообщение..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-purple-400 transition-colors">
            <Icon name="Smile" size={18} />
          </button>
          <button onClick={send} className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center transition-all hover:opacity-90 neon-glow">
            <Icon name="Send" size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Chats Tab ────────────────────────────────────────────────────────────────
const ChatsTab = ({ onOpenChat }: { onOpenChat: (chat: Chat) => void }) => {
  const [search, setSearch] = useState("");
  const filtered = chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold gradient-text">Чаты</h1>
          <button className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center neon-glow hover:opacity-90 transition-all">
            <Icon name="SquarePen" size={17} className="text-white" />
          </button>
        </div>
        <div className="glass rounded-xl flex items-center gap-2 px-3 py-2.5">
          <Icon name="Search" size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск чатов..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => onOpenChat(chat)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <AvatarEl letters={chat.avatar} online={chat.online} />
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{chat.name}</span>
                <span className="text-[11px] text-muted-foreground">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {chat.typing ? <span className="text-purple-400">печатает...</span> : chat.lastMessage}
                </span>
                {chat.unread ? (
                  <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full gradient-bg text-white text-[10px] font-bold flex items-center justify-center neon-glow">
                    {chat.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Contacts Tab ─────────────────────────────────────────────────────────────
const ContactsTab = ({ onCall }: { onCall: (name: string, type: "voice" | "video") => void }) => {
  const online = contacts.filter((c) => c.online);
  const offline = contacts.filter((c) => !c.online);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold gradient-text">Контакты</h1>
          <button className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center neon-glow hover:opacity-90 transition-all">
            <Icon name="UserPlus" size={17} className="text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Онлайн — {online.length}</p>
          <div className="space-y-1">
            {online.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <AvatarEl letters={c.avatar} online={c.online} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-green-400">{c.status}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onCall(c.name, "voice")} className="w-8 h-8 rounded-xl glass hover:bg-purple-500/20 flex items-center justify-center transition-all">
                    <Icon name="Phone" size={15} className="text-purple-400" />
                  </button>
                  <button onClick={() => onCall(c.name, "video")} className="w-8 h-8 rounded-xl glass hover:bg-purple-500/20 flex items-center justify-center transition-all">
                    <Icon name="Video" size={15} className="text-purple-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Недавно</p>
          <div className="space-y-1">
            {offline.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in" style={{ animationDelay: `${(i + online.length) * 50}ms` }}>
                <AvatarEl letters={c.avatar} online={c.online} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.status}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onCall(c.name, "voice")} className="w-8 h-8 rounded-xl glass hover:bg-purple-500/20 flex items-center justify-center transition-all">
                    <Icon name="Phone" size={15} className="text-muted-foreground" />
                  </button>
                  <button onClick={() => onCall(c.name, "video")} className="w-8 h-8 rounded-xl glass hover:bg-purple-500/20 flex items-center justify-center transition-all">
                    <Icon name="Video" size={15} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Search Tab ───────────────────────────────────────────────────────────────
const SearchTab = () => {
  const [query, setQuery] = useState("");
  const allItems = [
    ...chats.map((c) => ({ ...c, type: "chat" as const })),
    ...contacts.map((c) => ({ ...c, type: "contact" as const })),
  ];
  const results = query.length > 1 ? allItems.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold gradient-text mb-4">Поиск</h1>
        <div className="glass-strong rounded-xl flex items-center gap-2 px-3 py-3">
          <Icon name="Search" size={18} className="text-purple-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Люди, чаты, сообщения..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {!query && (
          <div className="mt-8 text-center">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 animate-float neon-glow">
              <Icon name="Search" size={28} className="text-white" />
            </div>
            <p className="text-muted-foreground text-sm">Начните вводить для поиска</p>
          </div>
        )}
        {query && results.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">Ничего не найдено по запросу «{query}»</p>
          </div>
        )}
        {results.map((item, i) => (
          <div
            key={`${item.type}-${item.id}`}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <AvatarEl letters={item.avatar} />
            <div className="flex-1">
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.type === "chat" ? "Чат" : "Контакт"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Notifications Tab ────────────────────────────────────────────────────────
const NotificationsTab = () => {
  const [notifs, setNotifs] = useState<NotificationItem[]>(initialNotifications);
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold gradient-text">Уведомления</h1>
            {unreadCount > 0 && (
              <span className="h-6 px-2 rounded-full gradient-bg text-white text-xs font-bold flex items-center neon-glow">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={() => setNotifs(notifs.map((n) => ({ ...n, read: true })))} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              Прочитать все
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {notifs.map((n, i) => (
          <div
            key={n.id}
            onClick={() => setNotifs(notifs.map((x) => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer animate-fade-in ${n.read ? "glass opacity-60" : "glass-strong"}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${n.color}22`, border: `1px solid ${n.color}44` }}>
              <Icon name={n.icon} size={18} style={{ color: n.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug">{n.text}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Profile Tab ──────────────────────────────────────────────────────────────
const ProfileTab = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold gradient-text">Профиль</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        <div className="glass-strong rounded-3xl p-6 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-main)" }} />
          <div className="relative">
            <AvatarEl letters="ВМ" size="xl" gradient="from-purple-500 to-pink-500" />
            <button className="absolute bottom-0 right-0 w-7 h-7 gradient-bg rounded-full flex items-center justify-center border-2 border-[hsl(var(--background))]">
              <Icon name="Camera" size={12} className="text-white" />
            </button>
          </div>
          <div className="text-center relative">
            <h2 className="text-xl font-bold">Владимир Митин</h2>
            <p className="text-muted-foreground text-sm mt-0.5">@vladimir_m</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
              <span className="text-xs text-green-400">Онлайн</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Контактов", value: "128", icon: "Users" as const },
            { label: "Чатов", value: "24", icon: "MessageCircle" as const },
            { label: "Звонков", value: "37", icon: "Phone" as const },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-3 text-center">
              <Icon name={stat.icon} size={18} className="text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold gradient-text">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          {[
            { icon: "Phone" as const, label: "Телефон", value: "+7 (999) 123-45-67" },
            { icon: "Mail" as const, label: "Email", value: "vladimir@pulse.app" },
            { icon: "MapPin" as const, label: "Город", value: "Москва, Россия" },
            { icon: "Info" as const, label: "О себе", value: "Разрабатываю крутые продукты 🚀" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i < 3 ? "border-b border-white/5" : ""}`}>
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon} size={16} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
                <p className="text-sm truncate">{item.value}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          ))}
        </div>

        <button className="w-full glass rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-all">
          <Icon name="Edit2" size={16} />
          Редактировать профиль
        </button>
      </div>
    </div>
  );
};

// ─── Settings Tab ─────────────────────────────────────────────────────────────
const SettingsTab = () => {
  const [notifOn, setNotifOn] = useState(true);
  const [soundsOn, setSoundsOn] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${value ? "gradient-bg" : "bg-white/10"}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? "left-7" : "left-1"}`} />
    </button>
  );

  const sections = [
    {
      title: "Уведомления",
      items: [
        { icon: "Bell" as const, label: "Push-уведомления", value: notifOn, onChange: () => setNotifOn(!notifOn) },
        { icon: "Volume2" as const, label: "Звуки", value: soundsOn, onChange: () => setSoundsOn(!soundsOn) },
      ],
    },
    {
      title: "Конфиденциальность",
      items: [
        { icon: "Eye" as const, label: "Подтверждение прочтения", value: readReceipts, onChange: () => setReadReceipts(!readReceipts) },
      ],
    },
    {
      title: "Внешний вид",
      items: [
        { icon: "Moon", label: "Тёмная тема", value: darkMode, onChange: () => setDarkMode(!darkMode) },
      ],
    },
  ];

  const links = [
    { icon: "Shield" as const, label: "Безопасность и пароль", danger: false },
    { icon: "Smartphone" as const, label: "Устройства", danger: false },
    { icon: "HelpCircle" as const, label: "Помощь и поддержка", danger: false },
    { icon: "LogOut" as const, label: "Выйти из аккаунта", danger: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold gradient-text">Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</p>
            <div className="glass rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i < section.items.length - 1 ? "border-b border-white/5" : ""}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    <Icon name={item.icon} size={16} className="text-purple-400" />
                  </div>
                  <span className="flex-1 text-sm">{item.label}</span>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Прочее</p>
          <div className="glass rounded-2xl overflow-hidden">
            {links.map((link, i) => (
              <button key={i} className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-all ${i < links.length - 1 ? "border-b border-white/5" : ""} ${link.danger ? "text-red-400" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${link.danger ? "bg-red-500/10 border border-red-500/20" : "glass"}`}>
                  <Icon name={link.icon} size={16} className={link.danger ? "text-red-400" : "text-purple-400"} />
                </div>
                <span className="flex-1 text-left text-sm">{link.label}</span>
                {!link.danger && <Icon name="ChevronRight" size={16} className="text-muted-foreground" />}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">Pulse v1.0.0</p>
      </div>
    </div>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const BottomNav = ({
  active,
  onChange,
  unreadNotifs,
  unreadChats,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  unreadNotifs: number;
  unreadChats: number;
}) => {
  const items = [
    { tab: "chats" as Tab, icon: "MessageCircle" as const, label: "Чаты", badge: unreadChats },
    { tab: "contacts" as Tab, icon: "Users" as const, label: "Контакты" },
    { tab: "search" as Tab, icon: "Search" as const, label: "Поиск" },
    { tab: "notifications" as Tab, icon: "Bell" as const, label: "Звонки", badge: unreadNotifs },
    { tab: "profile" as Tab, icon: "User" as const, label: "Профиль" },
  ];

  return (
    <div className="glass-strong border-t border-white/5 px-2 py-2 flex items-center justify-around flex-shrink-0">
      {items.map((item) => (
        <button
          key={item.tab}
          onClick={() => onChange(item.tab)}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all relative ${active === item.tab ? "nav-item-active" : "hover:bg-white/5"}`}
        >
          <div className="relative">
            <Icon
              name={item.icon}
              size={22}
              className={active === item.tab ? "text-purple-400" : "text-muted-foreground"}
            />
            {item.badge ? (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full gradient-bg text-white text-[9px] font-bold flex items-center justify-center">
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            ) : null}
          </div>
          <span className={`text-[10px] font-medium ${active === item.tab ? "text-purple-400" : "text-muted-foreground"}`}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [call, setCall] = useState<{ name: string; type: CallType }>({ name: "", type: null });

  const unreadChats = chats.reduce((acc, c) => acc + (c.unread || 0), 0);
  const unreadNotifs = initialNotifications.filter((n) => !n.read).length;

  const startCall = (name: string, type: "voice" | "video") => {
    setCall({ name, type });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center mesh-bg overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 rounded-full opacity-10 blur-3xl animate-pulse-slow" style={{ background: "var(--neon-purple)" }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-10 blur-3xl animate-pulse-slow" style={{ background: "var(--neon-blue)", animationDelay: "1.5s" }} />
        <div className="absolute top-[40%] left-[-10%] w-56 h-56 rounded-full opacity-10 blur-3xl animate-pulse-slow" style={{ background: "var(--neon-pink)", animationDelay: "3s" }} />
      </div>

      <div
        className="relative w-[390px] h-[844px] flex flex-col rounded-[44px] overflow-hidden"
        style={{ boxShadow: "0 0 60px rgba(168,85,247,0.2), 0 0 120px rgba(59,130,246,0.1), 0 40px 80px rgba(0,0,0,0.8)" }}
      >
        <div className="glass-strong flex items-center justify-between px-6 pt-3 pb-2 flex-shrink-0">
          <span className="text-xs font-semibold">9:41</span>
          <div className="w-28 h-6 glass rounded-full" />
          <div className="flex items-center gap-1.5">
            <Icon name="Wifi" size={13} className="text-foreground" />
            <Icon name="Battery" size={13} className="text-foreground" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col" style={{ background: "hsl(var(--background))" }}>
          <div className="flex-1 overflow-hidden">
            {activeChat ? (
              <ChatView
                chat={activeChat}
                onBack={() => setActiveChat(null)}
                onCall={(type) => startCall(activeChat.name, type)}
              />
            ) : (
              <>
                {tab === "chats" && <ChatsTab onOpenChat={setActiveChat} />}
                {tab === "contacts" && <ContactsTab onCall={startCall} />}
                {tab === "search" && <SearchTab />}
                {tab === "notifications" && <NotificationsTab />}
                {tab === "profile" && <ProfileTab />}
                {tab === "settings" && <SettingsTab />}
              </>
            )}
          </div>

          {!activeChat && (
            <BottomNav active={tab} onChange={setTab} unreadNotifs={unreadNotifs} unreadChats={unreadChats} />
          )}
        </div>
      </div>

      {call.type && (
        <CallOverlay callType={call.type} callee={call.name} onEnd={() => setCall({ name: "", type: null })} />
      )}
    </div>
  );
}