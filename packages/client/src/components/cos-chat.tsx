import { useState, useRef, useEffect, useCallback } from 'react';

export interface ChatMessage {
  role: 'cos' | 'ceo';
  text: string;
}

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  cosName?: string;
  ceoName?: string;
  typing?: boolean;
}

export function CoSChat({ messages, onSend, cosName = 'Alex Chen', ceoName = 'CEO', typing = false }: Props) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    onSend(text);
  }, [input, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerDot} />
        <div>
          <div style={styles.headerName}>{cosName}</div>
          <div style={styles.headerRole}>Chief of Staff</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(msg.role === 'ceo' ? styles.bubbleCeo : styles.bubbleCos),
            }}
          >
            <div style={styles.bubbleName}>
              {msg.role === 'cos' ? cosName : ceoName}
            </div>
            <div style={styles.bubbleText}>{msg.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ ...styles.bubble, ...styles.bubbleCos }}>
            <div style={styles.bubbleName}>{cosName}</div>
            <div style={styles.typingDots}>
              <span style={styles.dot}>●</span>
              <span style={{ ...styles.dot, animationDelay: '0.2s' }}>●</span>
              <span style={{ ...styles.dot, animationDelay: '0.4s' }}>●</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply to your Chief of Staff..."
          style={styles.input}
          disabled={typing}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || typing}
          style={{
            ...styles.sendBtn,
            ...(!input.trim() || typing ? styles.sendBtnDisabled : {}),
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 380,
    maxHeight: '70vh',
    background: 'linear-gradient(165deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
    zIndex: 50,
    overflow: 'hidden',
  },
  header: {
    padding: '14px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  headerDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#48bb78',
    boxShadow: '0 0 6px rgba(72,187,120,0.5)',
  },
  headerName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
  },
  headerRole: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minHeight: 200,
    maxHeight: 400,
  },
  bubble: {
    padding: '8px 12px',
    borderRadius: 12,
    maxWidth: '85%',
  },
  bubbleCos: {
    background: 'rgba(255,255,255,0.06)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleCeo: {
    background: 'rgba(74,144,217,0.2)',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleName: {
    fontSize: 10,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 3,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: '1.5',
    color: 'rgba(255,255,255,0.85)',
  },
  typingDots: {
    display: 'flex',
    gap: 4,
    padding: '2px 0',
  },
  dot: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.4)',
    animation: 'dotPulse 1s infinite',
  },
  inputArea: {
    padding: '10px 14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    color: '#fff',
    outline: 'none',
  },
  sendBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #4A90D9, #357ABD)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  sendBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};
