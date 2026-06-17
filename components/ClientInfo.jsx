import React, { useState, useEffect } from 'react';
import { S } from '../utils/styles.js';
import { Field, SaveNote } from './Shared';

export default function ClientInfo({ storage }) {
  const def = {
    fullName: '', dateStarted: '', phoneEmail: '', occupation: '',
    primaryGoal: '', goal2: '', goal3: '', nonNeg: '', hobbies: '',
    fitnessActivity: '', eatingHabits: '', sleepPatterns: '',
    injuries: '', additional: '',
  };

  const [data, setData] = useState(def);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.load('clientInfo', def).then(d => d && setData(d));
  }, []);

  function upd(k, v) {
    const n = { ...data, [k]: v };
    setData(n);
    storage.save('clientInfo', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

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
          <Field label="Full Name">{inp('fullName')}</Field>
          <Field label="Date Started (MM/DD/YYYY)">{inp('dateStarted')}</Field>
        </div>
        <Field label="Phone / Email">{inp('phoneEmail')}</Field>
        <Field label="Occupation & Work Schedule">{ta('occupation', 3)}</Field>
        <Field label="Goal 1 — Primary Goal: why are you here?">{ta('primaryGoal', 3)}</Field>
        <Field label="Goal 2">{ta('goal2', 2)}</Field>
        <Field label="Goal 3">{ta('goal3', 2)}</Field>
        <Field label="Current Non-Negotiables">{ta('nonNeg', 2)}</Field>
        <Field label="Hobbies & Free Time">{ta('hobbies', 2)}</Field>
        <Field label="Current Fitness Activity">{ta('fitnessActivity', 2)}</Field>
        <Field label="Current Eating Habits — describe a typical day">{ta('eatingHabits', 3)}</Field>
        <Field label="Sleep — typical bedtime, wake time, quality">{ta('sleepPatterns', 2)}</Field>
        <Field label="Injuries, Medical Conditions, or Physical Limitations">{ta('injuries', 2)}</Field>
        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information</div>
          {ta('additional', 4)}
        </div>
        <SaveNote show={saved} />
      </div>
    </div>
  );
}
