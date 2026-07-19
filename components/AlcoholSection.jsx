import React, { useState } from 'react';
import { formatDayDate } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote } from './Shared';

export default function AlcoholSection({
  dayData, selectedDay, onSave, startDate,
}) {
  const [saved, setSaved] = useState(false);

  const dd = dayData.alcohol || {
    beer: '', mixed: '', otherNone: false, notes: '', addl: '',
  };

  function upd(k, v) {
    onSave('alcohol', { ...dd, [k]: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!startDate) {
    return (
      <div>
        <div style={S.blockGold}>SECTION 02 — ALCOHOL TRACKING</div>
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
      <div style={S.blockGold}>SECTION 02 — ALCOHOL TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBox}>
          Track all alcohol consumed each day. If no alcohol was consumed, write None in the Other / None field. Do not leave any day blank.
        </div>
        <div style={S.dayTag}>{formatDayDate(startDate, selectedDay)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'end' }}>
          <div style={S.field}>
            <label style={S.label}>Beer (12 oz drinks)</label>
            <input type="number" min="0" style={S.input} value={dd.beer || ''} onChange={e => upd('beer', e.target.value)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Mixed Drinks</label>
            <input type="number" min="0" style={S.input} value={dd.mixed || ''} onChange={e => upd('mixed', e.target.value)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Other / None</label>
            <label style={S.labelSm}>Wine, spirits, or write None</label>
            <input style={S.input} placeholder="None" value={dd.otherNone || ''} onChange={e => upd('otherNone', e.target.value)} />
          </div>
        </div>
        <Field label="Notes">
          <textarea style={S.textarea} value={dd.notes || ''} onChange={e => upd('notes', e.target.value)} />
        </Field>
        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information — Day {selectedDay}</div>
          <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
        </div>
        <SaveNote show={saved} />
      </div>
    </div>
  );
}
