import { useEffect, useRef, useState, useCallback } from 'react';
import { Engine } from '@babylonjs/core';
import { createCEOSuite } from './scenes/ceo-suite';
import { AvatarCreator } from './components/avatar-creator';
import { CoSChat } from './components/cos-chat';
import type { ChatMessage } from './components/cos-chat';
import type { AvatarConfig } from './types/avatar';
import { COS_NAME, COS_INTRO, COS_QUESTIONS } from './types/cos';

type Phase = 'avatar' | 'office';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('avatar');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const questionIndex = useRef(0);

  const handleAvatarConfirm = useCallback((config: AvatarConfig) => {
    setAvatarConfig(config);
    setPhase('office');
    // Start the CoS intro with a slight delay so the scene renders first
    setTimeout(() => {
      setMessages(COS_INTRO);
    }, 800);
  }, []);

  const handleSend = useCallback((text: string) => {
    // Add CEO message
    setMessages((prev) => [...prev, { role: 'ceo', text }]);

    // Simulate CoS response
    setTyping(true);
    const qi = questionIndex.current;
    setTimeout(() => {
      setTyping(false);
      if (qi < COS_QUESTIONS.length) {
        setMessages((prev) => [...prev, { role: 'cos', text: COS_QUESTIONS[qi]! }]);
        questionIndex.current = qi + 1;
      } else {
        // Final synthesis — placeholder until we wire up Claude API
        setMessages((prev) => [
          ...prev,
          {
            role: 'cos',
            text: `Love it. I've got everything I need. Let me put together your company DNA — mission statement, OKRs, culture profile, and target market. Give me a moment...`,
          },
        ]);
        // After another delay, show the "synthesized" result
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'cos',
              text: `Here's what I've drafted based on your vision. Once we connect to the AI backend, I'll generate this for real using Claude. For now — welcome to your company! Let's build something great.`,
            },
          ]);
        }, 2000);
      }
    }, 1200);
  }, []);

  useEffect(() => {
    if (phase !== 'office') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    const scene = createCEOSuite(engine, canvas, avatarConfig ?? undefined);

    engine.runRenderLoop(() => scene.render());

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, [phase]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0a0a1a' }}>
      {phase === 'office' && (
        <>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            padding: '16px 24px',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 12,
            backdropFilter: 'blur(10px)',
          }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>AI Company Simulator</h1>
            <p style={{ fontSize: 13, opacity: 0.7 }}>
              CEO Suite — {avatarConfig?.name ?? 'CEO'}
            </p>
          </div>

          {messages.length > 0 && (
            <CoSChat
              messages={messages}
              onSend={handleSend}
              cosName={COS_NAME}
              ceoName={avatarConfig?.name ?? 'CEO'}
              typing={typing}
            />
          )}
        </>
      )}

      {phase === 'avatar' && (
        <AvatarCreator onConfirm={handleAvatarConfirm} />
      )}
    </div>
  );
}
