import React, { useState, useEffect, useRef } from 'react';
import { GOLD, STEEL_LIGHT, BORDER } from '../utils/constants.js';
import { startPlusDay, todayISO } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote } from './Shared';

const DEFAULT = {
  w1_well: '', w1_challenge: '', w1_energy: '', w1_different: '',
  w2_well: '', w2_challenge: '', w2_energy: '', w2_different: '',
  additional: ''
};

const W1_KEYS = ['w1_well', 'w1_challenge', 'w1_energy', 'w1_different'];
const W2_KEYS = ['w2_well', 'w2_challenge', 'w2_energy', 'w2_different'];

const checkStyle = {
  color: GOLD, fontSize: 13, fontWeight: 700, marginLeft: 6,
};
const reqMsg = { color: '#cc0000', fontSize: 11, marginTop: 4 };
const submitBtn = {
  padding: '9px 20px',
  borderRadius: 5,
  border: '1.5px solid #000',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.5,
  background: GOLD,
  color: '#000',
  marginTop: 12,
};
const submittedBanner = {
  background: GOLD,
  color: '#fff',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.5,
  textAlign: 'center',
  padding: 6,
  borderRadius: 4,
  marginBottom: 8,
};

export default function ReflectSection({
  storage, dayCompleteDates = [], reflectSubmissions = [], onReflectSubmit,
}) {
  const [data, setData] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [w1Attempted, setW1Attempted] = useState(false);
  const [w2Attempted, setW2Attempted] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    storage.load('reflect6', DEFAULT).then(d => d && setData(d));
    storage.load('clientInfo', {}).then(ci => {
      if (ci && ci.dateStarted) setStartDate(ci.dateStarted);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function upd(key, val) {
    const next = { ...data, [key]: val };
    setData(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      storage.save('reflect6', next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 400);
  }

  // A week is submitted when reflectSubmissions holds an entry for it.
  const w1Submitted = reflectSubmissions.some(r => r.week === 1);
  const w2Submitted = reflectSubmissions.some(r => r.week === 2);

  // Day 7 = startDate + 6 days; Day 14 = startDate + 13 days.
  const day7Iso = startDate ? startPlusDay(startDate, 7) : null;
  const day14Iso = startDate ? startPlusDay(startDate, 14) : null;
  const w1Unlocked = !!day7Iso && dayCompleteDates.includes(day7Iso);
  const w2Unlocked = !!day14Iso && dayCompleteDates.includes(day14Iso);

  function submitWeek(week) {
    const keys = week === 1 ? W1_KEYS : W2_KEYS;
    const allFilled = keys.every(k => String(data[k] || '').trim());
    if (!allFilled) {
      if (week === 1) setW1Attempted(true);
      else setW2Attempted(true);
      return;
    }
    if (week === 1) setW1Attempted(false);
    else setW2Attempted(false);
    if (onReflectSubmit) onReflectSubmit(week, todayISO());
  }

  // Label with a gold check when filled — hidden once the week is submitted.
  const lbl = (text, k, submitted) => (
    <>
      {text}
      {!submitted && String(data[k] || '').trim() && (
        <span style={checkStyle}>✓</span>
      )}
    </>
  );

  // Required textarea for a week block.
  const ta = (k, submitted, attempted) => {
    const missing = !submitted && attempted && !String(data[k] || '').trim();
    return (
      <>
        <textarea
          style={{
            ...S.textarea,
            background: submitted ? '#f0f0f0' : undefined,
            cursor: submitted ? 'not-allowed' : undefined,
            border: missing ? '2px solid #cc0000' : undefined,
          }}
          disabled={submitted}
          value={data[k] || ''}
          onChange={e => upd(k, e.target.value)}
        />
        {missing && <div style={reqMsg}>Required</div>}
      </>
    );
  };

  // Optional textarea — Additional Information only.
  const taPlain = k => (
    <textarea
      style={S.textarea}
      value={data[k] || ''}
      onChange={e => upd(k, e.target.value)}
    />
  );

  return (
    <div>
      <div style={S.blockGold}>WEEKLY REFLECTION — WEEK 1</div>
      <div style={S.card}>
        {w1Submitted && (
          <div style={submittedBanner}>WEEK 1 REFLECTION SUBMITTED</div>
        )}
        <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginBottom: '12px' }}>
          Complete at end of Day 7. Answer thoughtfully — these questions surface patterns daily entries alone cannot capture.
        </div>
        <Field label={lbl('What went well this week?', 'w1_well', w1Submitted)}>
          {ta('w1_well', w1Submitted, w1Attempted)}
        </Field>
        <Field label={lbl('What was the biggest challenge?', 'w1_challenge', w1Submitted)}>
          {ta('w1_challenge', w1Submitted, w1Attempted)}
        </Field>
        <Field label={lbl('What did you notice about your energy levels?', 'w1_energy', w1Submitted)}>
          {ta('w1_energy', w1Submitted, w1Attempted)}
        </Field>
        <Field label={lbl('What would you do differently next week?', 'w1_different', w1Submitted)}>
          {ta('w1_different', w1Submitted, w1Attempted)}
        </Field>
        {!w1Submitted && w1Unlocked && (
          <button style={submitBtn} onClick={() => submitWeek(1)}>
            Submit Week 1 Reflection
          </button>
        )}
      </div>

      <div style={S.blockSteel}>WEEKLY REFLECTION — WEEK 2</div>
      <div style={S.card}>
        {w2Submitted && (
          <div style={submittedBanner}>WEEK 2 REFLECTION SUBMITTED</div>
        )}
        <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginBottom: '12px' }}>
          Complete at end of Day 14.
        </div>
        <Field label={lbl('What went well this week?', 'w2_well', w2Submitted)}>
          {ta('w2_well', w2Submitted, w2Attempted)}
        </Field>
        <Field label={lbl('What was the biggest challenge?', 'w2_challenge', w2Submitted)}>
          {ta('w2_challenge', w2Submitted, w2Attempted)}
        </Field>
        <Field label={lbl('What did you notice about your energy levels?', 'w2_energy', w2Submitted)}>
          {ta('w2_energy', w2Submitted, w2Attempted)}
        </Field>
        <Field label={lbl('What would you do differently next week?', 'w2_different', w2Submitted)}>
          {ta('w2_different', w2Submitted, w2Attempted)}
        </Field>
        {!w2Submitted && w2Unlocked && (
          <button style={submitBtn} onClick={() => submitWeek(2)}>
            Submit Week 2 Reflection
          </button>
        )}
      </div>

      <div style={S.blockDark}>ADDITIONAL INFORMATION</div>
      <div style={{
        background: STEEL_LIGHT,
        border: '1px solid ' + BORDER,
        borderTop: 'none',
        borderRadius: '0 0 4px 4px',
        padding: '12px',
        marginBottom: '16px'
      }}>
        {taPlain('additional')}
      </div>

      <SaveNote show={saved} />
    </div>
  );
}
