import React, { useState, useEffect } from 'react';
import { DAYS, ACTIVITIES, ACTIVITY_RATE, DARK } from '../utils/constants.js';
import { formatDayDate } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { DayBtn, Field, SaveNote, RatingButtons } from './Shared';

export default function FitnessSection({ storage, startDate }) {
  const [day, setDay] = useState(1);
  const [data, setData] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.load('fitness6', {}).then(d => d && setData(d));
  }, []);

  function getDayData(d) {
    return data[d] || { activity: '', activityOther: '', duration: '', intensity: null, notes: '', addl: '' };
  }

  function upd(k, v) {
    const n = { ...data, [day]: { ...getDayData(day), [k]: v } };
    setData(n);
    storage.save('fitness6', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const filled = {};
  DAYS.forEach(d => {
    const x = data[d];
    if (x && x.activity) filled[d] = true;
  });

  const dd = getDayData(day);
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

  return (
    <div>
      <div style={S.blockGold}>SECTION 03 — FITNESS & ACTIVITY TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBox}>
          Record all physical activity. Select from the dropdown or use Other. Select None if nothing was done. Select Rest for a deliberate recovery day. Calorie burn is estimated automatically from activity type and duration.
        </div>
        <div style={{ fontSize: '11px', color: '#6A6A6A', marginBottom: '7px' }}>Select a day to log:</div>
        <div style={S.dayPicker}>
          {DAYS.map(d => (
            <DayBtn key={d} day={d} active={d === day} filled={!!filled[d]} onClick={() => setDay(d)} />
          ))}
        </div>
        <div style={S.dayTag}>{formatDayDate(startDate, day)}</div>

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
          <Field label="Notes (steps if known)">
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
          <div style={S.addlLabel}>Additional Information — Day {day}</div>
          <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
        </div>
        <SaveNote show={saved} />
      </div>
    </div>
  );
}
