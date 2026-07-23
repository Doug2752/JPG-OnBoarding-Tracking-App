import React, { useState, useEffect } from 'react';
import { S } from '../utils/styles.js';
import { Field, SaveNote } from './Shared';

// Mirrors CI_REQUIRED in app/OBApp.jsx — kept in sync manually,
// ClientInfo cannot import from OBApp.
const CI_REQUIRED = [
  'fullName','dateStarted','phone','email','occupation','primaryGoal',
  'nonNeg','hobbies','fitnessActivity','eatingHabits','sleepPatterns',
  'injuries'
];

function isClientInfoFilled(ci) {
  return CI_REQUIRED.every(k => ci && typeof ci[k] === 'string'
    && ci[k].trim().length > 0);
}

// MM/DD/YYYY, checked for calendar validity as well as shape.
// new Date(y, m, 0) yields the last day of month m, so leap years
// resolve correctly without a special case.
function isValidDate(str) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return false;
  const [m, d, y] = str.split('/').map(Number);
  if (m < 1 || m > 12) return false;
  if (d < 1) return false;
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d > daysInMonth) return false;
  return true;
}

const checkStyle = {
  color: '#B8860B',
  fontWeight: 700,
  marginLeft: 6,
  fontSize: '1rem',
};

export default function ClientInfo({ storage, onDateStarted, onFillChange }) {
  const def = {
    fullName: '', preferredName: '', dateStarted: '', phone: '', email: '', occupation: '',
    primaryGoal: '', goal2: '', goal3: '', nonNeg: '', hobbies: '',
    fitnessActivity: '', eatingHabits: '', sleepPatterns: '',
    injuries: '', additional: '',
  };

  const [data, setData] = useState(def);
  const [saved, setSaved] = useState(false);
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    storage.load('clientInfo', def).then(d => d && setData(d));
  }, []);

  function upd(k, v) {
    const n = { ...data, [k]: v };
    setData(n);

    // A malformed start date stays on screen but is never persisted —
    // the day-number system reads dateStarted and cannot parse garbage.
    if (k === 'dateStarted') {
      const t = v.trim();
      if (t && !isValidDate(t)) {
        setDateError(true);
        return;
      }
      setDateError(false);
      // Keep OBApp's startDate in step — the day-number system reads it.
      if (onDateStarted && t) onDateStarted(t);
    }

    storage.save('clientInfo', n);
    if (onFillChange) onFillChange(isClientInfoFilled(n));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  // Gold check appears once a required field carries a value.
  const lbl = (text, k) => (
    <>
      {text}
      {String(data[k] || '').trim() && <span style={checkStyle}>✓</span>}
    </>
  );

  const inp = k => (
    <input style={S.input} value={data[k] || ''} onChange={e => upd(k, e.target.value)} />
  );

  const ta = (k, rows) => (
    <textarea
      style={{ ...S.textarea, minHeight: (rows || 2) * 28 + 'px' }}
      value={data[k] || ''}
      onChange={e => upd(k, e.target.value)}
    />
  );

  return (
    <div>
      <div style={S.blockGold}>CLIENT INFORMATION</div>
      <div style={S.card}>
        <div style={S.infoBox}>
          Complete this section once at the start of your 14-day period. Be specific — vague answers produce ambiguity which may taint the results.
        </div>
        <div style={S.grid2}>
          <Field label={lbl('Full Name (first and last)', 'fullName')}>{inp('fullName')}</Field>
          <Field label={lbl('Date Started (MM/DD/YYYY)', 'dateStarted')}>
            <input
              style={{
                ...S.input,
                border: dateError ? '2px solid #B02020' : S.input.border,
              }}
              value={data.dateStarted || ''}
              onChange={e => upd('dateStarted', e.target.value)}
            />
            {dateError && (
              <div style={{
                fontSize: '0.78rem',
                color: '#B02020',
                marginTop: 4,
              }}>
                Please use MM/DD/YYYY format (e.g. 07/20/2026)
              </div>
            )}
          </Field>
        </div>
        <Field label="Preferred Name">{inp('preferredName')}</Field>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><Field label={lbl('Phone', 'phone')}>{inp('phone')}</Field></div>
          <div style={{ flex: 1 }}><Field label={lbl('Email', 'email')}>{inp('email')}</Field></div>
        </div>
        <Field label={lbl('Occupation & Work Schedule', 'occupation')}>{ta('occupation', 3)}</Field>
        <Field label={lbl('Desired Outcome 1 — Primary Goal: why are you here?', 'primaryGoal')}>{ta('primaryGoal', 3)}</Field>
        <Field label="Desired Outcome 2">{ta('goal2', 2)}</Field>
        <Field label="Desired Outcome 3">{ta('goal3', 2)}</Field>
        <Field label={lbl('Current Non-Negotiables — important activities', 'nonNeg')}>{ta('nonNeg', 2)}</Field>
        <Field label={lbl('Hobbies & Free Time', 'hobbies')}>{ta('hobbies', 2)}</Field>
        <Field label={lbl('Current Fitness Activity — write None if no current fitness', 'fitnessActivity')}>{ta('fitnessActivity', 2)}</Field>
        <Field label={lbl('Current Eating Habits — describe a typical day', 'eatingHabits')}>{ta('eatingHabits', 3)}</Field>
        <Field label={lbl('Sleep — typical bedtime, wake time, quality, 1–10 scale, 10 = Great', 'sleepPatterns')}>{ta('sleepPatterns', 2)}</Field>
        <Field label={lbl('Injuries, Medical Conditions, or Physical Limitations', 'injuries')}>{ta('injuries', 2)}</Field>
        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information</div>
          {ta('additional', 4)}
        </div>
        <SaveNote show={saved} />
      </div>
    </div>
  );
}
