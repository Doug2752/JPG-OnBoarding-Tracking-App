import { describe, it, expect, vi } from 'vitest';
import { startPlusDay } from '../utils/date.js';

const START_DATE = '07/20/2026';

// Local implementation of dayForIso using the real startPlusDay
function dayForIso(iso, startDate) {
  for (let n = 1; n <= 14; n++) {
    if (startPlusDay(startDate, n) === iso) return n;
  }
  return null;
}

// Local implementation of onViewDay
function makeOnViewDay(startDate, setSelectedDay, setView) {
  return function onViewDay(iso) {
    const n = dayForIso(iso, startDate);
    if (n === null) return;
    setSelectedDay(n);
    setView('today');
  };
}

// Local implementation of onViewReflect
function makeOnViewReflect(setSelectedDay, setSection, setView) {
  return function onViewReflect(week) {
    setSelectedDay(week === 1 ? 7 : 14);
    setSection('reflect');
    setView('today');
  };
}

// ── GROUP 1: dayForIso ─────────────────────────────────────────

describe('dayForIso', () => {
  it('1a: returns 1 for startDate itself (2026-07-20)', () => {
    expect(dayForIso('2026-07-20', START_DATE)).toBe(1);
  });

  it('1b: returns 4 for startDate + 3 days (2026-07-23)', () => {
    expect(dayForIso('2026-07-23', START_DATE)).toBe(4);
  });

  it('1c: returns 14 for startDate + 13 days (2026-08-02)', () => {
    expect(dayForIso('2026-08-02', START_DATE)).toBe(14);
  });

  it('1d: returns null for a date before startDate (2026-07-18)', () => {
    expect(dayForIso('2026-07-18', START_DATE)).toBeNull();
  });

  it('1e: returns null for a date beyond Day 14 window (2026-09-01)', () => {
    expect(dayForIso('2026-09-01', START_DATE)).toBeNull();
  });
});

// ── GROUP 2: onViewDay logic ───────────────────────────────────

describe('onViewDay', () => {
  it('2a: valid iso calls setSelectedDay(4) and setView("today")', () => {
    const setSelectedDay = vi.fn();
    const setView = vi.fn();
    const onViewDay = makeOnViewDay(START_DATE, setSelectedDay, setView);

    onViewDay('2026-07-23');

    expect(setSelectedDay).toHaveBeenCalledWith(4);
    expect(setView).toHaveBeenCalledWith('today');
  });

  it('2b: iso before startDate — dayForIso returns null — no calls made', () => {
    const setSelectedDay = vi.fn();
    const setView = vi.fn();
    const onViewDay = makeOnViewDay(START_DATE, setSelectedDay, setView);

    onViewDay('2026-07-18');

    expect(setSelectedDay).not.toHaveBeenCalled();
    expect(setView).not.toHaveBeenCalled();
  });
});

// ── GROUP 3: onViewReflect logic ──────────────────────────────

describe('onViewReflect', () => {
  it('3a: week 1 calls setSelectedDay(7), setSection("reflect"), setView("today")', () => {
    const setSelectedDay = vi.fn();
    const setSection = vi.fn();
    const setView = vi.fn();
    const onViewReflect = makeOnViewReflect(setSelectedDay, setSection, setView);

    onViewReflect(1);

    expect(setSelectedDay).toHaveBeenCalledWith(7);
    expect(setSection).toHaveBeenCalledWith('reflect');
    expect(setView).toHaveBeenCalledWith('today');
  });

  it('3b: week 2 calls setSelectedDay(14), setSection("reflect"), setView("today")', () => {
    const setSelectedDay = vi.fn();
    const setSection = vi.fn();
    const setView = vi.fn();
    const onViewReflect = makeOnViewReflect(setSelectedDay, setSection, setView);

    onViewReflect(2);

    expect(setSelectedDay).toHaveBeenCalledWith(14);
    expect(setSection).toHaveBeenCalledWith('reflect');
    expect(setView).toHaveBeenCalledWith('today');
  });
});
