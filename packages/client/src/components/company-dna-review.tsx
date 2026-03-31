import { useState, useCallback } from 'react';
import type { CompanyDna } from '../api/cos';

interface Props {
  dna: CompanyDna;
  onConfirm: (dna: CompanyDna) => void;
  onBack: () => void;
}

export function CompanyDnaReview({ dna, onConfirm, onBack }: Props) {
  const [editing, setEditing] = useState<CompanyDna>({ ...dna });

  const updateMission = useCallback((val: string) => {
    setEditing((prev) => ({ ...prev, mission: val }));
  }, []);

  const updateTargetMarket = useCallback((val: string) => {
    setEditing((prev) => ({ ...prev, targetMarket: val }));
  }, []);

  const updateCulture = useCallback((index: number, val: string) => {
    setEditing((prev) => {
      const culture = [...prev.culture];
      culture[index] = val;
      return { ...prev, culture };
    });
  }, []);

  const updateOkrObjective = useCallback((i: number, val: string) => {
    setEditing((prev) => {
      const okrs = prev.okrs.map((o, idx) =>
        idx === i ? { ...o, objective: val } : o,
      );
      return { ...prev, okrs };
    });
  }, []);

  const updateKeyResult = useCallback((oi: number, ki: number, val: string) => {
    setEditing((prev) => {
      const okrs = prev.okrs.map((o, idx) => {
        if (idx !== oi) return o;
        const keyResults = [...o.keyResults];
        keyResults[ki] = val;
        return { ...o, keyResults };
      });
      return { ...prev, okrs };
    });
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <h1 style={styles.title}>Your Company DNA</h1>
          <p style={styles.subtitle}>Review and edit before finalizing</p>
        </div>

        <div style={styles.body}>
          {/* Mission */}
          <Section label="Mission Statement">
            <textarea
              value={editing.mission}
              onChange={(e) => updateMission(e.target.value)}
              style={styles.textarea}
              rows={3}
            />
          </Section>

          {/* Target Market */}
          <Section label="Target Market">
            <textarea
              value={editing.targetMarket}
              onChange={(e) => updateTargetMarket(e.target.value)}
              style={styles.textarea}
              rows={3}
            />
          </Section>

          {/* Culture */}
          <Section label="Culture Personality">
            <div style={styles.cultureRow}>
              {editing.culture.map((c, i) => (
                <input
                  key={i}
                  value={c}
                  onChange={(e) => updateCulture(i, e.target.value)}
                  style={styles.cultureChip}
                />
              ))}
            </div>
          </Section>

          {/* OKRs */}
          <Section label="OKRs (Objectives & Key Results)">
            {editing.okrs.map((okr, oi) => (
              <div key={oi} style={styles.okrBlock}>
                <input
                  value={okr.objective}
                  onChange={(e) => updateOkrObjective(oi, e.target.value)}
                  style={styles.okrObjective}
                />
                {okr.keyResults.map((kr, ki) => (
                  <div key={ki} style={styles.krRow}>
                    <span style={styles.krBullet}>→</span>
                    <input
                      value={kr}
                      onChange={(e) => updateKeyResult(oi, ki, e.target.value)}
                      style={styles.krInput}
                    />
                  </div>
                ))}
              </div>
            ))}
          </Section>
        </div>

        <div style={styles.footer}>
          <button style={styles.backBtn} onClick={onBack}>
            ← Back to Chat
          </button>
          <button style={styles.confirmBtn} onClick={() => onConfirm(editing)}>
            Confirm & Launch Company 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionLabel}>{label}</div>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(6px)',
    zIndex: 100,
  },
  panel: {
    width: 680,
    maxWidth: '95vw',
    maxHeight: '92vh',
    background: 'linear-gradient(165deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  header: {
    padding: '24px 32px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    margin: '4px 0 0',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.4)',
  },
  textarea: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: '#fff',
    outline: 'none',
    resize: 'vertical' as const,
    lineHeight: '1.5',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  cultureRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  cultureChip: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid rgba(99,179,237,0.4)',
    background: 'rgba(99,179,237,0.1)',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
    width: 130,
    textAlign: 'center' as const,
  },
  okrBlock: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 6,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  okrObjective: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    padding: '4px 0 6px',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    outline: 'none',
    width: '100%',
    marginBottom: 8,
  },
  krRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  krBullet: {
    color: 'rgba(99,179,237,0.6)',
    fontSize: 12,
  },
  krInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '3px 0',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    outline: 'none',
  },
  footer: {
    padding: '16px 32px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: '10px 20px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: 13,
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '12px 28px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #48bb78, #38a169)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
