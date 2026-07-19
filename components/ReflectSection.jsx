import React, { useState, useEffect, useRef } from 'react';
import { STEEL_LIGHT, BORDER } from '../utils/constants.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote } from './Shared';

const DEFAULT = {
  w1_well: '', w1_challenge: '', w1_energy: '', w1_different: '',
  w2_well: '', w2_challenge: '', w2_energy: '', w2_different: '',
  additional: ''
};

export default function ReflectSection({ storage }) {
  const [data, setData] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    storage.load('reflect6', DEFAULT).then(d => d && setData(d));
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

  const ta = k => (
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
        <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginBottom: '12px' }}>
          Complete at end of Day 7. Answer thoughtfully — these questions surface patterns daily entries alone cannot capture.
        </div>
        <Field label="What went well this week?">{ta('w1_well')}</Field>
        <Field label="What was the biggest challenge?">{ta('w1_challenge')}</Field>
        <Field label="What did you notice about your energy levels?">{ta('w1_energy')}</Field>
        <Field label="What would you do differently next week?">{ta('w1_different')}</Field>
      </div>

      <div style={S.blockSteel}>WEEKLY REFLECTION — WEEK 2</div>
      <div style={S.card}>
        <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginBottom: '12px' }}>
          Complete at end of Day 14.
        </div>
        <Field label="What went well this week?">{ta('w2_well')}</Field>
        <Field label="What was the biggest challenge?">{ta('w2_challenge')}</Field>
        <Field label="What did you notice about your energy levels?">{ta('w2_energy')}</Field>
        <Field label="What would you do differently next week?">{ta('w2_different')}</Field>
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
        {ta('additional')}
      </div>

      <SaveNote show={saved} />
    </div>
  );
}

