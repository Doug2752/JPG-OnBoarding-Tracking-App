import React, { useState } from 'react';
import { SUPPLEMENTS, BURGUNDY, STEEL, GREEN } from '../utils/constants.js';
import { S } from '../utils/styles.js';
import { Field } from './Shared';

export default function SuppAdder({ suppLog, onUpdSupps, recentSupps, onUpdateRecent }) {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(null);
  const [q, setQ] = useState('');
  const [dosage, setDosage] = useState('');
  const [selected, setSelected] = useState('');
  const [meal, setMeal] = useState('AM');

  const filtered = q.length >= 2
    ? (() => {
        const ql = q.toLowerCase();
        const hits = [];
        Object.entries(SUPPLEMENTS).forEach(([, items]) =>
          items.forEach(it => { if (it.toLowerCase().includes(ql)) hits.push(it); })
        );
        return hits.slice(0, 12);
      })()
    : null;

  function addSupp(name) {
    setSelected(name);
    setQ('');
    setCat(null);
    setOpen(false);
  }

  function confirmAdd() {
    if (!selected) return;
    const entry = { name: selected, dosage: dosage || '', meal };
    onUpdSupps([...suppLog, entry]);
    const next = [selected, ...recentSupps.filter(r => r !== selected)].slice(0, 10);
    onUpdateRecent(next);
    setSelected('');
    setDosage('');
    setMeal('AM');
  }

  function removeSupp(i) {
    onUpdSupps(suppLog.filter((_, idx) => idx !== i));
  }

  const MEALS = ['AM', 'Midday', 'PM'];
  const mc = { AM: BURGUNDY, Midday: STEEL, PM: GREEN };

  return (
    <div>
      {MEALS.map(m => {
        const items = suppLog.filter(e => e.meal === m);
        if (!items.length) return null;
        return (
          <div key={m} style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: mc[m], textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>
              {m}
            </div>
            <div style={S.chipWrap}>
              {items.map((e, i) => {
                const ri = suppLog.indexOf(e);
                return (
                  <span key={i} style={S.chipBurgundy}>
                    {e.name}{e.dosage ? ' — ' + e.dosage : ''}
                    <button style={S.chipXBurgundy} onClick={() => removeSupp(ri)}>×</button>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}

      {selected && (
        <div style={{ background: '#f5eef1', border: '1px solid ' + BURGUNDY, borderRadius: '4px', padding: '10px 12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: BURGUNDY, marginBottom: '8px' }}>
            Adding: {selected}
          </div>
          <div style={S.grid3}>
            <Field label="Dosage (e.g. 400mg)">
              <input style={S.input} placeholder="Dosage..." value={dosage} onChange={e => setDosage(e.target.value)} />
            </Field>
            <Field label="Meal">
              <select style={S.select} value={meal} onChange={e => setMeal(e.target.value)}>
                {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label=" ">
              <button
                style={{ ...S.copyBtn, width: '100%', background: BURGUNDY, color: '#fff', border: 'none', marginTop: '14px' }}
                onClick={confirmAdd}
              >
                Add ✓
              </button>
            </Field>
          </div>
          <button
            style={{ fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => { setSelected(''); setDosage(''); }}
          >
            Cancel
          </button>
        </div>
      )}

      <button style={{ ...S.copyBtnBurgundy, marginBottom: '6px' }} onClick={() => setOpen(!open)}>
        {open ? '▲ Close' : '＋ Add Supplement'}
      </button>

      {open && (
        <div style={{ marginBottom: '8px' }}>
          <input
            style={{ ...S.input, marginBottom: '5px', fontSize: '12px' }}
            placeholder="Search supplements..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <div style={S.suppPanel}>
            {!q && recentSupps.length > 0 && (
              <div>
                <div style={S.suppRecentBurgundy}>★ Recent</div>
                {recentSupps.map(s => (
                  <div key={s} style={S.suppRecentItemBurgundy} onClick={() => addSupp(s)}>{s}</div>
                ))}
              </div>
            )}
            {q && filtered && filtered.map(s => (
              <div key={s} style={S.suppItem} onClick={() => addSupp(s)}>{s}</div>
            ))}
            {!q && Object.entries(SUPPLEMENTS).map(([catName, items]) => (
              <div key={catName}>
                <div style={S.suppCat} onClick={() => setCat(cat === catName ? null : catName)}>
                  {cat === catName ? '▼' : '▶'} {catName}
                </div>
                {cat === catName && items.map(s => (
                  <div key={s} style={S.suppItem} onClick={() => addSupp(s)}>{s}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
