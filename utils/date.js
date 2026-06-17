// ── DATE UTILITIES ────────────────────────────────────────────
import { MONTHS } from './constants.js';

export function parseDateStr(s) {
  if (!s) return null;
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return null;
}

export function formatDayDate(start, dayNum) {
  const base = parseDateStr(start);
  if (!base) return 'Day ' + dayNum;
  const d = new Date(base);
  d.setDate(d.getDate() + dayNum - 1);
  return 'Day ' + dayNum + ' \u2014 ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

