import React from 'react';
import { GOLD, BORDER } from '../utils/constants.js';
import { S } from '../utils/styles.js';

export default function MealBlock({ mealKey, mealLabel, dayVal, estimates, estimating, getVal, onUpd, onEstimate, error }) {
  const estKey = dayVal + '_' + mealKey;
  const est = estimates[estKey];
  const isLoading = estimating[estKey];

  const placeholder =
    mealKey === 'am'
      ? 'Example: 2 scrambled eggs, whole wheat toast with butter, black coffee.'
      : mealKey === 'midday'
      ? 'Example: Grilled chicken sandwich, side salad, sparkling water.'
      : 'Example: Salmon fillet, roasted vegetables, brown rice.';

  function handleKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEstimate(mealKey, e.target.value);
    }
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: GOLD, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>
        {mealLabel}
      </div>
      <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic', marginBottom: '4px' }}>
        Describe food and drink. Press Return to calculate calories.
      </div>
      <textarea
        style={error ? { ...S.textarea, border: '2px solid #cc0000' } : S.textarea}
        placeholder={placeholder}
        value={getVal(mealKey)}
        onChange={e => onUpd(mealKey, e.target.value)}
        onBlur={e => onEstimate(mealKey, e.target.value)}
        onKeyDown={handleKey}
      />
      {error && (
        <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>Required</div>
      )}
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
