import React from 'react';
import { BURGUNDY, BORDER } from '../utils/constants.js';
import { S } from '../utils/styles.js';

export default function SnackBlock({ idx, snackText, dayVal, estimates, estimating, onUpdText, onEstimate, onRemove }) {
  const estKey = dayVal + '_snack' + idx;
  const est = estimates[estKey];
  const isLoading = estimating[estKey];

  function handleKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEstimate('snack' + idx, e.target.value);
    }
  }

  return (
    <div style={{ marginBottom: '10px', background: '#fafaf8', border: '1px solid ' + BORDER, borderRadius: '4px', padding: '10px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Snack {idx + 1}
        </div>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '14px', fontWeight: '700', fontFamily: 'inherit' }}
          onClick={onRemove}
        >
          ×
        </button>
      </div>
      <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic', marginBottom: '4px' }}>
        Describe snack. Press Return to calculate calories.
      </div>
      <textarea
        style={{ ...S.textarea, minHeight: '44px' }}
        placeholder="Example: Apple and peanut butter, protein shake, handful of almonds."
        value={snackText || ''}
        onChange={e => onUpdText(e.target.value)}
        onBlur={e => onEstimate('snack' + idx, e.target.value)}
        onKeyDown={handleKey}
      />
      {isLoading && (
        <div style={{ ...S.calEst, color: '#aaa' }}>⏳ Estimating calories...</div>
      )}
      {!isLoading && est && (
        <div style={S.calEst}>
          ~ {est.cal.toLocaleString()} kcal estimated{est.note ? ' · ' + est.note : ''}
        </div>
      )}
    </div>
  );
}
