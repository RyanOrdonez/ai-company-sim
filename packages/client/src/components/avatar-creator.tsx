import { useState, useCallback } from 'react';
import {
  AvatarConfig,
  CEOArchetype,
  HairStyle,
  Accessory,
  ARCHETYPE_INFO,
  SKIN_TONES,
  HAIR_COLORS,
  OUTFIT_COLORS,
  HAIR_STYLES,
  ACCESSORIES,
  randomAvatar,
} from '../types/avatar';

interface Props {
  onConfirm: (config: AvatarConfig) => void;
}

export function AvatarCreator({ onConfirm }: Props) {
  const [config, setConfig] = useState<AvatarConfig>(randomAvatar);

  const update = useCallback(<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reroll = useCallback(() => {
    setConfig(randomAvatar());
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Create Your CEO</h1>
          <p style={styles.subtitle}>Who will lead this company?</p>
        </div>

        <div style={styles.body}>
          {/* Left column — options */}
          <div style={styles.leftCol}>
            {/* Name */}
            <Section label="Name">
              <input
                type="text"
                value={config.name}
                onChange={(e) => update('name', e.target.value)}
                style={styles.nameInput}
                placeholder="Enter CEO name..."
                maxLength={30}
              />
            </Section>

            {/* Skin Tone */}
            <Section label="Skin Tone">
              <div style={styles.swatchRow}>
                {SKIN_TONES.map((t) => (
                  <Swatch
                    key={t.id}
                    hex={t.hex}
                    selected={config.skinTone === t.hex}
                    onClick={() => update('skinTone', t.hex)}
                  />
                ))}
              </div>
            </Section>

            {/* Hair Style */}
            <Section label="Hair Style">
              <div style={styles.pillRow}>
                {HAIR_STYLES.map((h) => (
                  <Pill
                    key={h.id}
                    label={h.label}
                    selected={config.hairStyle === h.id}
                    onClick={() => update('hairStyle', h.id as HairStyle)}
                  />
                ))}
              </div>
            </Section>

            {/* Hair Color */}
            <Section label="Hair Color">
              <div style={styles.swatchRow}>
                {HAIR_COLORS.map((c) => (
                  <Swatch
                    key={c.id}
                    hex={c.hex}
                    selected={config.hairColor === c.hex}
                    onClick={() => update('hairColor', c.hex)}
                  />
                ))}
              </div>
            </Section>

            {/* Outfit Color */}
            <Section label="Suit Color">
              <div style={styles.swatchRow}>
                {OUTFIT_COLORS.map((c) => (
                  <Swatch
                    key={c.id}
                    hex={c.hex}
                    selected={config.outfitColor === c.hex}
                    onClick={() => update('outfitColor', c.hex)}
                  />
                ))}
              </div>
            </Section>

            {/* Accessory */}
            <Section label="Accessory">
              <div style={styles.pillRow}>
                {ACCESSORIES.map((a) => (
                  <Pill
                    key={a.id}
                    label={a.label}
                    selected={config.accessory === a.id}
                    onClick={() => update('accessory', a.id as Accessory)}
                  />
                ))}
              </div>
            </Section>
          </div>

          {/* Right column — archetype + preview card */}
          <div style={styles.rightCol}>
            {/* Avatar preview card */}
            <div style={styles.previewCard}>
              <div style={{ ...styles.previewAvatar, background: config.skinTone }}>
                <div style={{ ...styles.previewHair, background: config.hairColor }} />
                <div style={styles.previewFace}>
                  {config.accessory !== 'none' && (
                    <div style={styles.previewGlasses}>
                      {config.accessory === 'sunglasses' ? '🕶️' : '👓'}
                    </div>
                  )}
                </div>
                <div style={{ ...styles.previewBody, background: config.outfitColor }} />
              </div>
              <div style={styles.previewName}>{config.name || 'Unnamed CEO'}</div>
              <div style={styles.previewArchetype}>
                {ARCHETYPE_INFO[config.archetype].label}
              </div>
            </div>

            {/* Archetype selection */}
            <Section label="CEO Archetype">
              <div style={styles.archetypeList}>
                {(Object.entries(ARCHETYPE_INFO) as [CEOArchetype, { label: string; desc: string }][]).map(
                  ([id, info]) => (
                    <button
                      key={id}
                      style={{
                        ...styles.archetypeBtn,
                        ...(config.archetype === id ? styles.archetypeBtnActive : {}),
                      }}
                      onClick={() => update('archetype', id)}
                    >
                      <div style={styles.archetypeLabel}>{info.label}</div>
                      <div style={styles.archetypeDesc}>{info.desc}</div>
                    </button>
                  ),
                )}
              </div>
            </Section>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={styles.footer}>
          <button style={styles.randomBtn} onClick={reroll}>
            🎲 Randomize
          </button>
          <button
            style={{
              ...styles.confirmBtn,
              ...(config.name.trim() ? {} : styles.confirmBtnDisabled),
            }}
            onClick={() => config.name.trim() && onConfirm(config)}
            disabled={!config.name.trim()}
          >
            Confirm & Enter Office →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionLabel}>{label}</div>
      {children}
    </div>
  );
}

function Swatch({ hex, selected, onClick }: { hex: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.swatch,
        background: hex,
        ...(selected ? styles.swatchSelected : {}),
      }}
    />
  );
}

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.pill,
        ...(selected ? styles.pillSelected : {}),
      }}
    >
      {label}
    </button>
  );
}

// ── Styles ──────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 100,
  },
  panel: {
    width: 820,
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
    fontSize: 26,
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: '4px 0 0',
  },
  body: {
    display: 'flex',
    gap: 24,
    padding: '20px 32px',
    overflowY: 'auto',
    flex: 1,
  },
  leftCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  rightCol: {
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.4)',
  },
  nameInput: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 16,
    color: '#fff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  swatchRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap' as const,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  swatchSelected: {
    border: '2px solid #fff',
    boxShadow: '0 0 0 2px rgba(99,179,237,0.5)',
    transform: 'scale(1.1)',
  },
  pillRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap' as const,
  },
  pill: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  pillSelected: {
    background: 'rgba(99,179,237,0.2)',
    border: '1px solid rgba(99,179,237,0.5)',
    color: '#fff',
  },
  previewCard: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    position: 'relative',
    overflow: 'hidden',
  },
  previewHair: {
    position: 'absolute',
    top: 0,
    left: '10%',
    width: '80%',
    height: '40%',
    borderRadius: '50% 50% 0 0',
  },
  previewFace: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '60%',
    height: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewGlasses: {
    fontSize: 20,
  },
  previewBody: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    width: '70%',
    height: '30%',
    borderRadius: '40% 40% 0 0',
  },
  previewName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center' as const,
  },
  previewArchetype: {
    fontSize: 12,
    color: 'rgba(99,179,237,0.8)',
    fontWeight: 500,
  },
  archetypeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  archetypeBtn: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
  },
  archetypeBtnActive: {
    background: 'rgba(99,179,237,0.12)',
    border: '1px solid rgba(99,179,237,0.4)',
  },
  archetypeLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  archetypeDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  footer: {
    padding: '16px 32px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  randomBtn: {
    padding: '10px 20px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  confirmBtn: {
    padding: '12px 28px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #4A90D9, #357ABD)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  confirmBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};
