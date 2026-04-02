import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Chat, Message, messagesMap, chats } from "./types";
import { AvatarEl } from "./MessengerShared";

// ─── Chat View ────────────────────────────────────────────────────────────────
export const ChatView = ({
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
export const ChatsTab = ({ onOpenChat }: { onOpenChat: (chat: Chat) => void }) => {
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
