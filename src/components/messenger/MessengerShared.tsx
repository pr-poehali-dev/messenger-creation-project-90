import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CallType, Tab } from "./types";

// ─── Avatar Component ─────────────────────────────────────────────────────────
export const AvatarEl = ({
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
export const CallOverlay = ({
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

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
export const BottomNav = ({
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
