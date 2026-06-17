import React, { useState, useEffect } from 'react';
import { DAYS, BORDER, CHARCOAL, GOLD } from '../utils/constants.js';
import { formatDayDate } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { DayBtn, SummaryBtn, Field, SaveNote } from './Shared';

export default function AlcoholSection({ storage, startDate }) {
  const [day, setDay] = useState(1);
  const [data, setData] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.load('alcohol6', {}).then(d => d && setData(d));
  }, []);

  function getDayData(d) {
    return data[d] || { beer: '', mixed: '', otherNone: '', notes: '', addl: '' };
  }

  function upd(k, v) {
    const n = { ...data, [day]: { ...getDayData(day), [k]: v } };
    setData(n);
    storage.save('alcohol6', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const filled = {};
  DAYS.forEach(d => {
    const x = data[d];
    if (x && (x.beer || x.mixed || x.otherNone)) filled[d] = true;
  });

  const dd = getDayData(day);
  const isSummary = day === 15;

  function buildSummary() {
    let b = 0, m = 0;
    DAYS.forEach(d => {
      const x = data[d];
      if (!x) return;
      b += parseInt(x.beer) || 0;
      m += parseInt(x.mixed) || 0;
    });
    return { totalBeer: b, totalMixed: m, total: b + m };
  }

  const summaryView = () => {
    const s = buildSummary();
    return (
      <div>
        <div style={{ ...S.blockCharcoal, borderRadius: '4px' }}>14-DAY ALCOHOL SUMMARY</div>
        <div style={{ background: '#f8f8f6', border: '1px solid ' + BORDER, borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '16px' }}>
          <div style={S.grid3}>
            {[['Beer (12 oz)', s.totalBeer], ['Mixed Drinks', s.totalMixed], ['Total Drinks', s.total]].map(([l, v]) => (
              <div key={l} style={{ background: CHARCOAL, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: GOLD }}>{v}</div>
                <div style={{ fontSize: '9px', color: '#aaa', letterSpacing: '1px', marginTop: '2px' }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const dailyView = () => (
    <div>
      <div style={S.dayTag}>{formatDayDate(startDate, day)}</div>
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
        <div style={S.addlLabel}>Additional Information — Day {day}</div>
        <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
      </div>
      <SaveNote show={saved} />
    </div>
  );

  return (
    <div>
      <div style={S.blockGold}>SECTION 02 — ALCOHOL TRACKING</div>
      <div style={S.card}>
        {!isSummary && (
          <div style={S.infoBox}>
            Track all alcohol consumed each day. If no alcohol was consumed, write None in the Other / None field. Do not leave any day blank.
          </div>
        )}
        <div style={{ fontSize: '11px', color: '#6A6A6A', marginBottom: '7px' }}>Select a day to log:</div>
        <div style={S.dayPicker}>
          {DAYS.map(d => (
            <DayBtn key={d} day={d} active={d === day} filled={!!filled[d]} onClick={() => setDay(d)} />
          ))}
          <SummaryBtn active={day === 15} onClick={() => setDay(15)} />
        </div>
        {isSummary ? summaryView() : dailyView()}
      </div>
    </div>
  );
}
