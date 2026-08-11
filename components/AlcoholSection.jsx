import React, { useState } from 'react';
import { PURPLE } from '../utils/constants.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote } from './Shared';

export default function AlcoholSection({
  dayData, selectedDay, onSave, startDate, onDaySelect, dayComplete, attempted,
}) {
  const [saved, setSaved] = useState(false);

  const dd = dayData.alcohol || {
    beer: '', mixed: '', otherAlc: '', alcoholNone: false, notes: '', addl: '',
  };

  const alcoholMissing = attempted && !(
    dd.alcoholNone === true ||
    (dd.beer && String(dd.beer).trim()) ||
    (dd.mixed && String(dd.mixed).trim()) ||
    (dd.otherAlc && String(dd.otherAlc).trim())
  );

  function upd(k, v) {
    onSave('alcohol', { ...dd, [k]: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!startDate) {
    return (
      <div>
        <div style={S.blockPurple}>SECTION 02 — ALCOHOL TRACKING</div>
        <div style={S.card}>
          <div style={S.infoBoxPurple}>
            Your start date has not been set yet. Return to the Home screen and tap Start Today's Entry to begin, or enter your start date on the Client Info page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={S.blockPurple}>SECTION 02 — ALCOHOL TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBoxPurple}>
          Track all alcohol consumed each day. If no alcohol was consumed, check the None box. Do not leave any day blank.
        </div>
        {dayComplete && (
          <div style={{ background: PURPLE, color: '#fff', fontSize: 11, fontWeight: 700, textAlign: 'center', padding: 4, borderRadius: 4, marginBottom: 8 }}>
            Day marked complete — unlock to edit
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <input
            type="checkbox"
            id="alcoholNone"
            style={{ accentColor: PURPLE }}
            checked={dd.alcoholNone || false}
            disabled={dayComplete}
            onChange={e => upd('alcoholNone', e.target.checked)}
          />
          <label htmlFor="alcoholNone" style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>None</label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'end' }}>
          <div style={S.field}>
            <label style={S.label}>Beer (12 oz drinks){dd.beer && String(dd.beer).trim() && <span style={{ color: PURPLE, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
            <input type="number" min="0" style={{ ...S.input, background: dayComplete ? '#f5f5f3' : undefined, border: alcoholMissing ? '2px solid #cc0000' : undefined }} readOnly={dayComplete} value={dd.beer || ''} onChange={e => upd('beer', e.target.value)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Mixed Drinks{dd.mixed && String(dd.mixed).trim() && <span style={{ color: PURPLE, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
            <input type="number" min="0" style={{ ...S.input, background: dayComplete ? '#f5f5f3' : undefined, border: alcoholMissing ? '2px solid #cc0000' : undefined }} readOnly={dayComplete} value={dd.mixed || ''} onChange={e => upd('mixed', e.target.value)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Other{dd.otherAlc && String(dd.otherAlc).trim() && <span style={{ color: PURPLE, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
            <label style={S.labelSm}>Wine, spirits, cocktails — describe and quantity</label>
            <input style={{ ...S.input, background: dayComplete ? '#f5f5f3' : undefined, border: alcoholMissing ? '2px solid #cc0000' : undefined }} readOnly={dayComplete} placeholder="Describe..." value={dd.otherAlc || ''} onChange={e => upd('otherAlc', e.target.value)} />
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
