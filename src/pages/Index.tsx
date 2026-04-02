import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Tab, CallType, Chat, chats, initialNotifications } from "@/components/messenger/types";
import { AvatarEl, CallOverlay, BottomNav } from "@/components/messenger/MessengerShared";
import { ChatView, ChatsTab } from "@/components/messenger/MessengerChats";
import { ContactsTab, SearchTab, NotificationsTab, ProfileTab, SettingsTab } from "@/components/messenger/MessengerTabs";

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
