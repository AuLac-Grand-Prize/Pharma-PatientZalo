import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Mic, Send, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/cn";
import { haptic } from "@/lib/haptics";
import { sendQuestion } from "@/services/ask-pharmacist";
import type { ChatMessage } from "@/types";

const SUGGESTED = [
  "Tôi nên uống paracetamol như thế nào khi sốt?",
  "Loratadin có gây buồn ngủ không?",
  "Có nên uống vitamin C khi đang dùng kháng sinh?",
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Xin chào! Tôi là dược sĩ AI của PharmLink. Hỏi tôi về thuốc, liều dùng, tác dụng phụ — tôi sẽ trả lời 24/7 bằng tiếng Việt.",
      at: "now",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    if (!text.trim()) return;
    haptic("light");
    const user: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      at: new Date().toISOString(),
    };
    setMessages((m) => [...m, user]);
    setInput("");
    setSending(true);
    try {
      const content = await sendQuestion(text);
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        at: new Date().toISOString(),
      };
      setMessages((m) => [...m, reply]);
      haptic("success");
    } catch {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Xin lỗi, hiện chưa kết nối được dược sĩ AI. Vui lòng thử lại sau.",
        at: new Date().toISOString(),
      };
      setMessages((m) => [...m, reply]);
      haptic("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Hỏi dược sĩ AI"
        subtitle="PharmaGPT-VN · Tiếng Việt 24/7"
        right={
          <div className="grid h-9 w-9 place-items-center rounded-pill bg-violet-100 text-violet-600">
            <Bot className="h-4 w-4" />
          </div>
        }
      />

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-4">
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Dược sĩ AI đang trả lời...
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="space-y-2 bg-surface px-4 py-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="w-full rounded-2xl border border-line bg-white px-3 py-2.5 text-left text-sm text-ink active:bg-brand-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-center gap-2 border-t border-line bg-white px-4 py-3"
      >
        <button
          type="button"
          aria-label="Voice"
          className="grid h-10 w-10 place-items-center rounded-pill bg-surface text-ink-muted"
        >
          <Mic className="h-4 w-4" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi về thuốc, liều dùng..."
          className="h-10 flex-1 rounded-pill border border-line bg-white px-4 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label="Gửi"
          className="grid h-10 w-10 place-items-center rounded-pill bg-brand text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </AppShell>
  );
}

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-pill",
          isUser ? "bg-brand-100 text-brand" : "bg-violet-100 text-violet-600",
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser ? "rounded-tr-sm bg-brand text-white" : "rounded-tl-sm bg-white text-ink shadow-soft",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
