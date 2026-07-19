import React, { useState, useEffect } from 'react';
import { GOLD } from '../utils/constants.js';
import { formatDayDate, startPlusDay } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { SaveNote } from './Shared';
import MealBlock from './MealBlock';
import SnackBlock from './SnackBlock';
import SuppAdder from './SuppAdder';
async function estimateCalories(text) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'You are a nutrition expert. When given a meal description, respond ONLY with a JSON object in this exact format with no other text: {"cal": 450, "note": "estimate based on portion size"}. The cal field must be an integer. Keep the note under 60 characters.',
        messages: [{ role: 'user', content: 'Estimate calories for: ' + text }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

export default function NutritionSection({
  storage, dayData, selectedDay, onSave, startDate, onDaySelect, dayComplete,
}) {
  const [saved, setSaved] = useState(false);
  const [recentSupps, setRecentSupps] = useState([]);
  const [estimates, setEstimates] = useState({});
  const [estimating, setEstimating] = useState({});

  useEffect(() => {
    storage.load('recentSupps6', []).then(d => d && setRecentSupps(d));
    storage.load('calEst6', {}).then(d => d && setEstimates(d));
  }, []);

  const dd = dayData.nutrition || {
    am: '', midday: '', pm: '', snacks: [], suppLog: [], addl: '',
  };

  function upd(k, v) {
    onSave('nutrition', { ...dd, [k]: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function updRecents(r) {
    setRecentSupps(r);
    storage.save('recentSupps6', r);
  }

  async function runEstimate(meal, text) {
    if (!text || text.trim().length < 5) return;
    const key = selectedDay + '_' + meal;
    setEstimating(prev => ({ ...prev, [key]: true }));
    const result = await estimateCalories(text);
    setEstimating(prev => ({ ...prev, [key]: false }));
    if (result && result.cal) {
      const n = { ...estimates, [key]: result };
      setEstimates(n);
      storage.save('calEst6', n);
    }
  }

  const snacks = dd.snacks || [];
  const dayCal =
    ['am', 'midday', 'pm'].reduce((s, m) => {
      const e = estimates[selectedDay + '_' + m];
      return s + (e ? e.cal : 0);
    }, 0) +
    snacks.reduce((s, _, i) => {
      const e = estimates[selectedDay + '_snack' + i];
      return s + (e ? e.cal : 0);
    }, 0);

  if (!startDate) {
    return (
      <div>
        <div style={S.blockGold}>SECTION 01 — NUTRITION TRACKING</div>
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
      <div style={S.blockGold}>SECTION 01 — NUTRITION TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBox}>
          Record everything you eat and drink — AM, Midday, PM. Press Return in any field to calculate calories. Use Add Snack for anything eaten between meals. Each snack generates its own estimate and contributes to the daily total.
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
        <div style={{ pointerEvents: dayComplete ? 'none' : 'auto', opacity: dayComplete ? 0.7 : 1 }}>
          <MealBlock mealKey="am"
            mealLabel={<>AM{dd.am && dd.am.trim() && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</>}
            dayVal={selectedDay} estimates={estimates} estimating={estimating}
            getVal={k => dd[k] || ''} onUpd={upd} onEstimate={runEstimate} />
          <MealBlock mealKey="midday"
            mealLabel={<>Midday{dd.midday && dd.midday.trim() && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</>}
            dayVal={selectedDay} estimates={estimates} estimating={estimating}
            getVal={k => dd[k] || ''} onUpd={upd} onEstimate={runEstimate} />
          <MealBlock mealKey="pm"
            mealLabel={<>PM{dd.pm && dd.pm.trim() && <span style={{ color: '#B8860B', fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</>}
            dayVal={selectedDay} estimates={estimates} estimating={estimating}
            getVal={k => dd[k] || ''} onUpd={upd} onEstimate={runEstimate} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          {snacks.map((snack, i) => (
            <SnackBlock
              key={i} idx={i} snackText={snack} dayVal={selectedDay}
              estimates={estimates} estimating={estimating}
              onUpdText={text => {
                const s = [...snacks];
                s[i] = text;
                upd('snacks', s);
              }}
              onEstimate={runEstimate}
              onRemove={() => upd('snacks', snacks.filter((_, idx) => idx !== i))}
            />
          ))}
          {snacks.length < 10 && (
            <button style={{ ...S.copyBtn, fontSize: '11px' }} onClick={() => upd('snacks', [...snacks, ''])}>
              + Add Snack
            </button>
          )}
        </div>

        {dayCal > 0 && (
          <div style={S.calTotal}>
            <div>
              <div style={S.calLabel}>Estimated Daily Calories</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>AI estimate — approximate only</div>
            </div>
            <div style={S.calValue}>{dayCal.toLocaleString()} kcal</div>
          </div>
        )}

        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Supplements — Day {selectedDay}</div>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '8px', fontStyle: 'italic' }}>
            Include name and dosage for each (e.g. Vitamin D3 — 5,000 IU)
          </div>
          <SuppAdder
            suppLog={dd.suppLog || []}
            onUpdSupps={log => upd('suppLog', log)}
            recentSupps={recentSupps}
            onUpdateRecent={updRecents}
          />
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
