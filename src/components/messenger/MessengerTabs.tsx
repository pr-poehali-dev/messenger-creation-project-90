import { useState } from "react";
import Icon from "@/components/ui/icon";
import { NotificationItem, contacts, chats, initialNotifications } from "./types";
import { AvatarEl } from "./MessengerShared";

// ─── Contacts Tab ─────────────────────────────────────────────────────────────
export const ContactsTab = ({ onCall }: { onCall: (name: string, type: "voice" | "video") => void }) => {
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
export const SearchTab = () => {
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
export const NotificationsTab = () => {
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
export const ProfileTab = () => {
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
export const SettingsTab = () => {
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
        { icon: "Moon" as const, label: "Тёмная тема", value: darkMode, onChange: () => setDarkMode(!darkMode) },
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
