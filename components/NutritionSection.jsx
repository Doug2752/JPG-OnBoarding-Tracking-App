import React, { useState, useEffect } from 'react';
import { DAYS, BORDER } from '../utils/constants.js';
import { formatDayDate } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { DayBtn, SummaryBtn, SaveNote } from './Shared';
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

export default function NutritionSection({ storage, startDate }) {
  const [day, setDay] = useState(1);
  const [data, setData] = useState({});
  const [recentSupps, setRecentSupps] = useState([]);
  const [saved, setSaved] = useState(false);
  const [estimates, setEstimates] = useState({});
  const [estimating, setEstimating] = useState({});

  useEffect(() => {
    storage.load('nutrition6', {}).then(d => d && setData(d));
    storage.load('recentSupps6', []).then(d => d && setRecentSupps(d));
    storage.load('calEst6', {}).then(d => d && setEstimates(d));
  }, []);

  function getDayData(d) {
    return data[d] || { am: '', midday: '', pm: '', snacks: [], suppLog: [], addl: '' };
  }

  function upd(k, v) {
    const dd = { ...getDayData(day), [k]: v };
    const n = { ...data, [day]: dd };
    setData(n);
    storage.save('nutrition6', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function updRecents(r) {
    setRecentSupps(r);
    storage.save('recentSupps6', r);
  }

  async function runEstimate(meal, text) {
    if (!text || text.trim().length < 5) return;
    const key = day + '_' + meal;
    setEstimating(prev => ({ ...prev, [key]: true }));
    const result = await estimateCalories(text);
    setEstimating(prev => ({ ...prev, [key]: false }));
    if (result && result.cal) {
      const n = { ...estimates, [key]: result };
      setEstimates(n);
      storage.save('calEst6', n);
    }
  }

  const dd = getDayData(day);
  const isSummary = day === 15;

  const filled = {};
  DAYS.forEach(d => {
    const x = data[d];
    if (x && (x.am || x.midday || x.pm)) filled[d] = true;
  });

  const snacks = dd.snacks || [];
  const dayCal =
    ['am', 'midday', 'pm'].reduce((s, m) => {
      const e = estimates[day + '_' + m];
      return s + (e ? e.cal : 0);
    }, 0) +
    snacks.reduce((s, _, i) => {
      const e = estimates[day + '_snack' + i];
      return s + (e ? e.cal : 0);
    }, 0);

  function buildSummary() {
    let totalCal = 0, entryCount = 0;
    DAYS.forEach(d => {
      ['am', 'midday', 'pm'].forEach(m => {
        const e = estimates[d + '_' + m];
        if (e) { totalCal += e.cal || 0; entryCount++; }
      });
      const x = data[d];
      if (x && x.snacks) x.snacks.forEach((_, i) => {
        const e = estimates[d + '_snack' + i];
        if (e) { totalCal += e.cal || 0; entryCount++; }
      });
    });
    return { totalCal, entryCount };
  }

  const sumData = isSummary ? buildSummary() : null;

  const summaryView = () => (
    <div>
      <div style={{ ...S.blockCharcoal, borderRadius: '4px' }}>14-DAY NUTRITION SUMMARY</div>
      <div style={{ background: '#f8f8f6', border: '1px solid ' + BORDER, borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '16px' }}>
        <div style={S.grid2}>
          <div style={{ background: '#B8912A', borderRadius: '6px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>{sumData.totalCal.toLocaleString()}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px', marginTop: '2px' }}>ESTIMATED TOTAL CALORIES</div>
          </div>
          <div style={{ background: '#2C2C2C', borderRadius: '6px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>{sumData.entryCount}</div>
            <div style={{ fontSize: '9px', color: '#aaa', letterSpacing: '1px', marginTop: '2px' }}>MEALS & SNACKS WITH ESTIMATES</div>
          </div>
        </div>
        <div style={{ marginTop: '12px', fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
          Calorie values are AI-generated estimates from your meal descriptions. For general awareness only.
        </div>
      </div>
    </div>
  );

  const dailyView = () => (
    <div>
      <div style={S.dayTag}>{formatDayDate(startDate, day)}</div>
      <MealBlock mealKey="am" mealLabel="AM" dayVal={day} estimates={estimates} estimating={estimating}
        getVal={k => getDayData(day)[k] || ''} onUpd={upd} onEstimate={runEstimate} />
      <MealBlock mealKey="midday" mealLabel="Midday" dayVal={day} estimates={estimates} estimating={estimating}
        getVal={k => getDayData(day)[k] || ''} onUpd={upd} onEstimate={runEstimate} />
      <MealBlock mealKey="pm" mealLabel="PM" dayVal={day} estimates={estimates} estimating={estimating}
        getVal={k => getDayData(day)[k] || ''} onUpd={upd} onEstimate={runEstimate} />

      <div style={{ marginBottom: '12px' }}>
        {snacks.map((snack, i) => (
          <SnackBlock
            key={i} idx={i} snackText={snack} dayVal={day}
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
        <div style={S.addlLabel}>Supplements — Day {day}</div>
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
        <div style={S.addlLabel}>Additional Information — Day {day}</div>
        <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
      </div>
      <SaveNote show={saved} />
    </div>
  );

  return (
    <div>
      <div style={S.blockGold}>SECTION 01 — NUTRITION TRACKING</div>
      <div style={S.card}>
        {!isSummary && (
          <div style={S.infoBox}>
            Record everything you eat and drink — AM, Midday, PM. Press Return in any field to calculate calories. Use Add Snack for anything eaten between meals. Each snack generates its own estimate and contributes to the daily total.
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
