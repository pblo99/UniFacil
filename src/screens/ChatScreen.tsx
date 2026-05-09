import { useEffect, useRef, useState } from 'react';
import { Send, Users } from 'lucide-react';
import Button from '../components/Button';
import TopBar from '../components/TopBar';
import type { ChatMessage } from '../types/app';
import { formatTimeLabel } from '../utils/format';

interface ChatScreenProps {
  messages: ChatMessage[];
  onBack?: () => void;
  onSend: (message: string) => void;
}

export default function ChatScreen({ messages, onBack, onSend }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    onSend(message.trim());
    setMessage('');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Chat Geral"
        subtitle="45 participantes"
        onBack={onBack}
        action={
          <div className="rounded-full bg-white p-3 text-text-secondary shadow-card">
            <Users className="h-5 w-5" />
          </div>
        }
      />
      <div className="flex flex-1 flex-col overflow-hidden px-5 pb-5">
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {messages.map((chatMessage) => (
            <div key={chatMessage.id} className={`flex ${chatMessage.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-[22px] px-4 py-3 shadow-card ${
                  chatMessage.isOwn ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-white text-text-primary'
                }`}
              >
                <p className={`text-xs font-semibold ${chatMessage.isOwn ? 'text-white/80' : 'text-text-secondary'}`}>
                  {chatMessage.author}
                </p>
                <p className="mt-1 text-sm leading-6">{chatMessage.message}</p>
                <p className={`mt-2 text-[11px] ${chatMessage.isOwn ? 'text-white/80' : 'text-text-secondary'}`}>
                  {formatTimeLabel(chatMessage.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-border/80 pt-4">
          <input
            aria-label="Digite sua mensagem"
            className="min-h-[52px] flex-1 rounded-input border border-border bg-white px-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary/60"
            placeholder="Digite uma mensagem..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Button type="submit" className="min-h-[52px] min-w-[52px] rounded-full px-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
