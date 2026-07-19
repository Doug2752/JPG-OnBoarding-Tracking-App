import React, { useState } from 'react';
import { ACTIVITIES, ACTIVITY_RATE, DARK } from '../utils/constants.js';
import { formatDayDate } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote, RatingButtons } from './Shared';

export default function FitnessSection({
  dayData, selectedDay, onSave, startDate,
}) {
  const [saved, setSaved] = useState(false);

  const dd = dayData.fitness || {
    activity: '', activityOther: '', duration: '',
    intensity: null, notes: '', addl: '',
  };

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
            Set a start date first — use the date picker at the top
            of the page. Daily entries are keyed to your start date.
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
        <div style={S.dayTag}>{formatDayDate(startDate, selectedDay)}</div>

        <Field label="Activity / Workout">
          <select style={S.select} value={dd.activity || ''} onChange={e => upd('activity', e.target.value)}>
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
          <Field label="Duration (minutes)">
            <input type="number" min="0" style={S.input} placeholder="e.g. 45"
              value={dd.duration || ''} onChange={e => upd('duration', e.target.value)} />
          </Field>
          <Field label="Notes (enter None if no workout)">
            <input style={S.input} value={dd.notes || ''} onChange={e => upd('notes', e.target.value)} />
          </Field>
        </div>

        <Field label="Intensity 1–10 (RPE)">
          <RatingButtons value={dd.intensity} onChange={v => upd('intensity', v)} />
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
