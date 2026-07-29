import React from 'react';
import { S } from '../utils/styles';
import { GOLD, GOLD_DARK } from '../utils/constants';

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

export function RatingButtons({ value, onChange, steel, disabled, activeColor = GOLD, activeBorderColor = GOLD_DARK }) {
  return (
    <div style={disabled ? { pointerEvents: 'none', opacity: 0.7 } : undefined}>
      <div style={S.ratingRow}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => {
          const active = value === n;
          const steelBase = steel
            ? { background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff' }
            : {};
          const extra = active
            ? steel
              ? { background: 'rgba(255,255,255,0.25)', border: '2px solid #fff', color: '#fff' }
              : { background: activeColor, border: '2px solid ' + activeBorderColor, color: '#fff' }
            : {};
          return (
            <button
              key={n}
              style={{ ...S.ratingBtn, ...steelBase, ...extra }}
              onClick={() => onChange(active ? null : n)}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InputWithToggle({ value, onChange, placeholder, type, unitLabel, onToggle, readOnly, unitColor = GOLD }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type={type || 'text'}
        style={{ ...S.input, flex: 1, ...(readOnly ? { background: '#f5f5f3', cursor: 'default' } : {}) }}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        readOnly={readOnly}
      />
      <button
        style={{ ...S.unitBtn, border: '1px solid ' + unitColor, color: unitColor, ...(readOnly ? { opacity: 0.5, cursor: 'default' } : {}) }}
        disabled={readOnly}
        onClick={onToggle}
      >{unitLabel}</button>
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
