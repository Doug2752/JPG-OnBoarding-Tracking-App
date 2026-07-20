import React, { useState } from 'react';
import { GOLD } from '../utils/constants.js';
import { formatDayDate, startPlusDay } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote } from './Shared';

export default function AlcoholSection({
  dayData, selectedDay, onSave, startDate, onDaySelect, dayComplete, attempted,
}) {
  const [saved, setSaved] = useState(false);

  const dd = dayData.alcohol || {
    beer: '', mixed: '', otherNone: false, notes: '', addl: '',
  };

  const alcoholMissing = attempted && !(
    (dd.beer && String(dd.beer).trim()) ||
    (dd.mixed && String(dd.mixed).trim()) ||
    (dd.otherNone && String(dd.otherNone).trim())
  );

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'end' }}>
          <div style={S.field}>
            <label style={S.label}>Beer (12 oz drinks){dd.beer && String(dd.beer).trim() && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
            <input type="number" min="0" style={{ ...S.input, background: dayComplete ? '#f5f5f3' : undefined, border: alcoholMissing ? '2px solid #cc0000' : undefined }} readOnly={dayComplete} value={dd.beer || ''} onChange={e => upd('beer', e.target.value)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Mixed Drinks{dd.mixed && String(dd.mixed).trim() && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
            <input type="number" min="0" style={{ ...S.input, background: dayComplete ? '#f5f5f3' : undefined, border: alcoholMissing ? '2px solid #cc0000' : undefined }} readOnly={dayComplete} value={dd.mixed || ''} onChange={e => upd('mixed', e.target.value)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Other / None{((dd.beer && String(dd.beer).trim()) || (dd.mixed && String(dd.mixed).trim()) || (dd.otherNone && String(dd.otherNone).trim())) && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
            <label style={S.labelSm}>Wine, spirits, or write None</label>
            <input style={{ ...S.input, background: dayComplete ? '#f5f5f3' : undefined, border: alcoholMissing ? '2px solid #cc0000' : undefined }} readOnly={dayComplete} placeholder="None" value={dd.otherNone || ''} onChange={e => upd('otherNone', e.target.value)} />
          </div>
        </div>
        {alcoholMissing && (
          <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>At least one field is required</div>
        )}
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
