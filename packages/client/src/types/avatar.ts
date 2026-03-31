export interface AvatarConfig {
  name: string;
  archetype: CEOArchetype;
  skinTone: string;
  hairStyle: HairStyle;
  hairColor: string;
  outfitColor: string;
  accessory: Accessory;
}

export type CEOArchetype = 'visionary' | 'operator' | 'creative' | 'diplomat' | 'maverick';

export type HairStyle = 'short' | 'slicked' | 'curly' | 'long' | 'buzz' | 'bald';

export type Accessory = 'none' | 'glasses' | 'sunglasses';

export const ARCHETYPE_INFO: Record<CEOArchetype, { label: string; desc: string }> = {
  visionary: { label: 'The Visionary', desc: 'Big ideas, bold bets. You see what others can\'t.' },
  operator: { label: 'The Operator', desc: 'Systems thinker. You build machines that scale.' },
  creative: { label: 'The Creative', desc: 'Design-driven. Every detail tells a story.' },
  diplomat: { label: 'The Diplomat', desc: 'People first. Culture is your superpower.' },
  maverick: { label: 'The Maverick', desc: 'Break the rules. Disrupt everything.' },
};

export const SKIN_TONES = [
  { id: 'light', hex: '#F5D0B0' },
  { id: 'fair', hex: '#E8B88A' },
  { id: 'medium', hex: '#C68642' },
  { id: 'tan', hex: '#A0724A' },
  { id: 'brown', hex: '#7B5035' },
  { id: 'dark', hex: '#4A3021' },
];

export const HAIR_COLORS = [
  { id: 'black', hex: '#1A1A1A' },
  { id: 'darkBrown', hex: '#3B2314' },
  { id: 'brown', hex: '#6B4226' },
  { id: 'auburn', hex: '#8B3A1A' },
  { id: 'blonde', hex: '#C8A951' },
  { id: 'red', hex: '#A03020' },
  { id: 'gray', hex: '#8A8A8A' },
  { id: 'white', hex: '#D8D8D8' },
];

export const OUTFIT_COLORS = [
  { id: 'navy', hex: '#1B2A4A' },
  { id: 'charcoal', hex: '#333333' },
  { id: 'black', hex: '#1A1A1A' },
  { id: 'brown', hex: '#4A3520' },
  { id: 'burgundy', hex: '#5A1A2A' },
  { id: 'slate', hex: '#4A5568' },
  { id: 'forest', hex: '#1A3A2A' },
  { id: 'tan', hex: '#8B7355' },
];

export const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'slicked', label: 'Slicked Back' },
  { id: 'curly', label: 'Curly' },
  { id: 'long', label: 'Long' },
  { id: 'buzz', label: 'Buzz Cut' },
  { id: 'bald', label: 'Bald' },
];

export const ACCESSORIES: { id: Accessory; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'sunglasses', label: 'Sunglasses' },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake',
  'Cameron', 'Dakota', 'Emery', 'Finley', 'Harper', 'Kai', 'Logan', 'Peyton',
  'Reese', 'Sawyer', 'Taylor', 'Drew', 'Ellis', 'Rowan', 'Skyler', 'Phoenix',
];

const LAST_NAMES = [
  'Chen', 'Rivera', 'Kim', 'Okafor', 'Patel', 'Santos', 'Novak', 'Larsson',
  'Brooks', 'Tanaka', 'Morales', 'Wu', 'Foster', 'Shah', 'Berg', 'Cruz',
  'Huang', 'Reed', 'Park', 'Silva', 'Grant', 'Wolfe', 'Ortiz', 'Nakamura',
];

export function randomAvatar(): AvatarConfig {
  return {
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    archetype: pick<CEOArchetype>(['visionary', 'operator', 'creative', 'diplomat', 'maverick']),
    skinTone: pick(SKIN_TONES).hex,
    hairStyle: pick<HairStyle>(['short', 'slicked', 'curly', 'long', 'buzz', 'bald']),
    hairColor: pick(HAIR_COLORS).hex,
    outfitColor: pick(OUTFIT_COLORS).hex,
    accessory: pick<Accessory>(['none', 'none', 'glasses', 'sunglasses']), // weighted toward none
  };
}
