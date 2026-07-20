import React, { useState } from 'react';
import { ACTIVITIES, ACTIVITY_RATE, DARK, GOLD } from '../utils/constants.js';
import { formatDayDate, startPlusDay } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote, RatingButtons } from './Shared';

export default function FitnessSection({
  dayData, selectedDay, onSave, startDate, onDaySelect, dayComplete, attempted,
}) {
  const [saved, setSaved] = useState(false);

  const dd = dayData.fitness || {
    activity: '', activityOther: '', duration: '',
    intensity: null, notes: '', addl: '',
  };

  const activitySet = dd.activity && dd.activity !== '';
  const durationMissing = attempted && activitySet && !dd.duration;
  const intensityMissing = attempted && activitySet && !dd.intensity;

  function upd(k, v) {
    onSave('fitness', { ...dd, [k]: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const rate = ACTIVITY_RATE[dd.activity] || 0;
  const burnKcal = rate > 0 && parseFloat(dd.duration) > 0
    ? Math.round((parseFloat(dd.duration) / 60) * rate)
    : 0;

  const cats = {};
  ACTIVITIES.forEach(a => {
    if (!a[2]) {
      if (!cats['']) cats[''] = [];
      cats[''].push(a[0]);
      return;
    }
    if (!cats[a[2]]) cats[a[2]] = [];
    cats[a[2]].push(a[0]);
  });

  if (!startDate) {
    return (
      <div>
        <div style={S.blockGold}>SECTION 03 — FITNESS & ACTIVITY TRACKING</div>
        <div style={S.card}>
          <div style={S.infoBox}>
            Your start date has not been set yet. Return to the Home screen and tap Start Today's Entry to begin, or enter your start date on the Client Info page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={S.blockGold}>SECTION 03 — FITNESS & ACTIVITY TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBox}>
          Record all physical activity. Select from the dropdown or use Other. Select None if nothing was done. Select Rest for a deliberate recovery day. Calorie burn is estimated automatically from activity type and duration.
        </div>
        {dayComplete && (
          <div style={{ background: '#B8860B', color: '#fff', fontSize: 11, fontWeight: 700, textAlign: 'center', padding: 4, borderRadius: 4, marginBottom: 8 }}>
            Day marked complete — unlock to edit
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 5, marginBottom: 12 }}>
          {Array.from({ length: 14 }, (_, i) => i + 1).map(n => {
            const iso = startPlusDay(startDate, n);
            let lbl = '—';
            if (iso) {
              const [, m, d] = iso.split('-');
              const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              lbl = MON[parseInt(m, 10) - 1] + ' ' + parseInt(d, 10);
            }
            const active = n === selectedDay;
            return (
              <button key={n} onClick={() => onDaySelect(n)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                border: '1.5px solid #000', borderRadius: 4, padding: '5px 8px',
                cursor: 'pointer', background: active ? GOLD : '#333', color: '#fff', lineHeight: 1.2,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Day {n}</span>
                <span style={{ fontSize: 9, fontWeight: 400 }}>{lbl}</span>
              </button>
            );
          })}
        </div>
        <div style={S.dayTag}>{formatDayDate(startDate, selectedDay)}</div>

        <Field label={<>Activity / Workout{dd.activity && dd.activity !== '' && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</>}>
          <select style={S.select} disabled={dayComplete} value={dd.activity || ''} onChange={e => upd('activity', e.target.value)}>
            <option value="">Select activity...</option>
            {cats[''] && cats[''].map(a => <option key={a} value={a}>{a}</option>)}
            {Object.entries(cats).filter(([k]) => k).map(([catName, items]) => (
              <optgroup key={catName} label={catName}>
                {items.map(a => <option key={a} value={a}>{a}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>

        {dd.activity === 'Other — Write In' && (
          <Field label="Describe Activity">
            <input
              style={S.input}
              placeholder="Describe your activity..."
              value={dd.activityOther || ''}
              onChange={e => upd('activityOther', e.target.value)}
            />
          </Field>
        )}

        <div style={S.grid2}>
          <Field label={<>Duration (minutes){dd.activity && dd.activity !== '' && dd.duration && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</>}>
            <input type="number" min="0" style={{ ...S.input, background: dayComplete ? '#f5f5f3' : undefined, border: durationMissing ? '2px solid #cc0000' : undefined }} readOnly={dayComplete} placeholder="e.g. 45"
              value={dd.duration || ''} onChange={e => upd('duration', e.target.value)} />
            {durationMissing && (
              <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>Required</div>
            )}
          </Field>
          <Field label="Notes (enter None if no workout)">
            <input style={S.input} value={dd.notes || ''} onChange={e => upd('notes', e.target.value)} />
          </Field>
        </div>

        <Field label={<>Intensity 1–10 (RPE){dd.activity && dd.activity !== '' && dd.intensity && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</>}>
          <div style={intensityMissing ? { border: '2px solid #cc0000', borderRadius: 4 } : undefined}>
            <RatingButtons value={dd.intensity} onChange={v => upd('intensity', v)} disabled={dayComplete} />
          </div>
          {intensityMissing && (
            <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>Required</div>
          )}
        </Field>

        <div style={{ background: DARK, borderRadius: '4px', padding: '10px 14px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={S.calLabel}>Estimated Calorie Burn</div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>
              {rate > 0 ? 'Based on ' + rate + ' kcal/hr' : 'Select activity and duration to calculate'}
            </div>
          </div>
          <div style={S.calValue}>{burnKcal > 0 ? burnKcal.toLocaleString() + ' kcal' : '—'}</div>
        </div>

        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information — Day {selectedDay}</div>
          <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
        </div>
        <SaveNote show={saved} />
      </div>
    </div>
  );
}
