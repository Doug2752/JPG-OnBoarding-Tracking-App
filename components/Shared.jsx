import React from 'react';
import { S } from '../utils/styles';
import { GOLD, GOLD_DARK, GOLD_LIGHT, STEEL, STEEL_MID, MID } from '../utils/constants';

export function Field({ label, labelSm, children }) {
  return (
    <div style={S.field}>
      {label && <label style={S.label}>{label}</label>}
      {labelSm && <label style={S.labelSm}>{labelSm}</label>}
      {children}
    </div>
  );
}

export function SaveNote({ show }) {
  return show ? <div style={S.saveNote}>Saved.</div> : null;
}

export function DayBtn({ day, active, filled, onClick }) {
  const extra = active
    ? { background: GOLD, border: '2px solid ' + GOLD_DARK, color: '#fff' }
    : filled
    ? { background: GOLD_LIGHT, border: '2px solid ' + GOLD, color: GOLD_DARK }
    : {};
  return (
    <button style={{ ...S.ratingBtn, ...extra }} onClick={onClick}>
      {day}
    </button>
  );
}

export function SummaryBtn({ active, onClick }) {
  const extra = active
    ? { background: GOLD, border: '2px solid ' + GOLD_DARK, color: '#fff' }
    : { background: '#f0f0f0', border: '2px solid #ccc', color: MID };
  return (
    <button
      style={{ ...S.ratingBtn, width: 'auto', padding: '0 8px', fontSize: '9px', ...extra }}
      onClick={onClick}
    >
      Sum
    </button>
  );
}

export function RatingButtons({ value, onChange, steel }) {
  return (
    <div style={S.ratingRow}>
      {[1,2,3,4,5,6,7,8,9,10].map(n => {
        const active = value === n;
        const extra = active
          ? steel
            ? { background: STEEL, border: '2px solid ' + STEEL_MID, color: '#fff' }
            : { background: GOLD, border: '2px solid ' + GOLD_DARK, color: '#fff' }
          : {};
        return (
          <button
            key={n}
            style={{ ...S.ratingBtn, ...extra }}
            onClick={() => onChange(active ? null : n)}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

export function InputWithToggle({ value, onChange, placeholder, type, unitLabel, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type={type || 'text'}
        style={{ ...S.input, flex: 1 }}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
      />
      <button style={S.unitBtn} onClick={onToggle}>{unitLabel}</button>
    </div>
  );
}

export function SleepFieldCol({ label, labelSm, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ ...S.label, fontSize: '10px' }}>{label}</div>
        {labelSm && <div style={{ fontSize: '9px', color: '#888', marginBottom: '2px' }}>{labelSm}</div>}
      </div>
      <div style={{ marginTop: '4px' }}>{children}</div>
    </div>
  );
}
