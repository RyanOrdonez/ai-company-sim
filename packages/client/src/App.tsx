import { useEffect, useRef, useState, useCallback } from 'react';
import { Engine } from '@babylonjs/core';
import { createCEOSuite } from './scenes/ceo-suite';
import { AvatarCreator } from './components/avatar-creator';
import { CoSChat } from './components/cos-chat';
import { CompanyDnaReview } from './components/company-dna-review';
import type { ChatMessage } from './components/cos-chat';
import type { AvatarConfig } from './types/avatar';
import type { CompanyDna } from './api/cos';
import { sendCoSMessage } from './api/cos';
import { COS_NAME, COS_INTRO, COS_QUESTIONS } from './types/cos';

type Phase = 'avatar' | 'office';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('avatar');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [companyDna, setCompanyDna] = useState<CompanyDna | null>(null);
  const [showDnaReview, setShowDnaReview] = useState(false);
  const [dnaConfirmed, setDnaConfirmed] = useState(false);
  const questionIndex = useRef(0);
  const useAi = useRef(true);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Keep ref in sync
  messagesRef.current = messages;

  const handleAvatarConfirm = useCallback((config: AvatarConfig) => {
    setAvatarConfig(config);
    setPhase('office');
    setTimeout(() => {
      setMessages(COS_INTRO);
    }, 800);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    // Use ref for current messages to avoid stale closure
    const current = messagesRef.current;
    const newMessages: ChatMessage[] = [...current, { role: 'ceo' as const, text }];
    setMessages(newMessages);
    setTyping(true);

    // Try Claude API first
    if (useAi.current) {
      try {
        const response = await sendCoSMessage(
          newMessages.map((m) => ({ role: m.role, text: m.text })),
        );

        setTyping(false);
        setMessages((prev) => [...prev, { role: 'cos', text: response.text }]);

        if (response.companyDna) {
          setCompanyDna(response.companyDna);
          setTimeout(() => setShowDnaReview(true), 1500);
        }
        return;
      } catch {
        useAi.current = false;
        console.warn('AI endpoint unavailable, using scripted CoS responses');
      }
    }

    // Scripted fallback
    const qi = questionIndex.current;
    setTimeout(() => {
      setTyping(false);
      if (qi < COS_QUESTIONS.length) {
        setMessages((prev) => [...prev, { role: 'cos', text: COS_QUESTIONS[qi]! }]);
        questionIndex.current = qi + 1;
      } else {
        // Gather all CEO answers from the full conversation
        const allCeoAnswers = newMessages
          .filter((m) => m.role === 'ceo')
          .map((m) => m.text);

        const fallbackDna: CompanyDna = {
          mission: `We solve real problems for real people. ${allCeoAnswers[0] ?? ''}`.slice(0, 200),
          okrs: [
            {
              objective: 'Establish product-market fit',
              keyResults: ['Launch MVP', '100 beta users', '4.0+ satisfaction score'],
            },
            {
              objective: 'Build a world-class team',
              keyResults: ['Hire 5 key roles', 'Establish culture playbook', '90% retention'],
            },
            {
              objective: 'Achieve sustainable growth',
              keyResults: ['$100K ARR', '20% MoM growth', '3 enterprise clients'],
            },
          ],
          targetMarket: allCeoAnswers[0] ?? 'Early-stage companies and ambitious teams.',
          culture: (allCeoAnswers[1] ?? 'innovative fast collaborative bold').split(' ').slice(0, 4),
        };

        setCompanyDna(fallbackDna);

        setMessages((prev) => [
          ...prev,
          {
            role: 'cos',
            text: `I've put together your company DNA based on your vision. Take a look and edit anything before we finalize.`,
          },
        ]);

        setTimeout(() => setShowDnaReview(true), 1500);
      }
    }, 1200);
  }, []); // no deps — uses refs instead

  const handleDnaConfirm = useCallback((dna: CompanyDna) => {
    setCompanyDna(dna);
    setShowDnaReview(false);
    setDnaConfirmed(true);
    setMessages((prev) => [
      ...prev,
      {
        role: 'cos',
        text: `Company DNA is locked in. Your mission, culture, and OKRs are set. Welcome to your company — let's build something great. When you're ready, we'll start hiring your first team members.`,
      },
    ]);
  }, []);

  const handleDnaBack = useCallback(() => {
    setShowDnaReview(false);
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
            {dnaConfirmed && companyDna && (
              <p style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                {companyDna.mission.slice(0, 60)}...
              </p>
            )}
          </div>

          {messages.length > 0 && !showDnaReview && (
            <CoSChat
              messages={messages}
              onSend={handleSend}
              cosName={COS_NAME}
              ceoName={avatarConfig?.name ?? 'CEO'}
              typing={typing}
            />
          )}

          {showDnaReview && companyDna && (
            <CompanyDnaReview
              dna={companyDna}
              onConfirm={handleDnaConfirm}
              onBack={handleDnaBack}
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
