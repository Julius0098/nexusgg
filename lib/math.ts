export const yaw: Record<string, number> = {
  'Counter-Strike 2': 0.022,
  Valorant: 0.06996,
  'Apex Legends': 0.022,
  'Overwatch 2': 0.0066,
};
export const number = (value: number) => new Intl.NumberFormat('en-US', { maximumSignificantDigits: 8 }).format(value);
export const percent = (value: number) => number(value) + '%';

export function sensitivity(source: string, target: string, dpi: number, sens: number) {
  const converted = sens * yaw[source] / yaw[target];
  return { converted, edpi: converted * dpi, cm: 914.4 / (dpi * sens * yaw[source]) };
}

export function xp(level: number) {
  if (level <= 16) return level ** 2 + 6 * level;
  if (level <= 31) return (5 * level ** 2 - 81 * level + 720) / 2;
  return (9 * level ** 2 - 325 * level + 4440) / 2;
}

export function requiredWins(wins: number, matches: number, target: number) {
  if (wins > matches) throw Error('Wins must be at most the number of matches.');
  const basis = 100000;
  const scaledTarget = Math.round(target * basis);
  const remaining = scaledTarget * matches - 100 * basis * wins;
  if (matches > 0 && remaining <= 0) return 0;
  if (target === 100 && matches > wins) throw Error('A past loss makes a 100% lifetime win rate unreachable.');
  if (!matches) return 1;
  return Math.ceil(remaining / (100 * basis - scaledTarget));
}

export function anyDrop(chance: number, attempts: number) {
  if (!attempts || !chance) return 0;
  if (chance === 100) return 100;
  return -Math.expm1(attempts * Math.log1p(-chance / 100)) * 100;
}

export function otherFov(angle: number, width: number, height: number, direction: string) {
  const ratio = direction === 'Vertical → horizontal' ? width / height : height / width;
  return 2 * Math.atan(Math.tan(angle * Math.PI / 360) * ratio) * 180 / Math.PI;
}

export function ratio(top: number, bottom: number, label: string) {
  if (!bottom) throw Error(label + ' must be greater than zero.');
  return top / bottom;
}
