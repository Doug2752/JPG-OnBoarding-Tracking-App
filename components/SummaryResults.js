import React, { useState, useEffect } from 'react';
import {
  DAYS,
  GOLD, GOLD_LIGHT, GOLD_DARK,
  DARK, CHARCOAL, MID,
  BORDER, STEEL, GREEN,
  PERF_BANDS, SLEEP_BANDS,
  ACTIVITY_RATE
} from '../utils/constants.js';
import { S } from '../utils/styles.js';

// ── BAND TABLE (local — only used in SummaryResults) ──────────
function BandTable({ bands, title, cols, labels, getCells, activeLabel }) {
  return (
    <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid ' + BORDER, marginBottom: '14px' }}>
      <div style={{ background: GREEN, padding: '11px 16px', textAlign: 'center', fontWeight: '700', color: '#fff', fontSize: '13px', letterSpacing: '2px' }}>
        {title}
      </div>
      <div style={{ background: '#f0f0f0', display: 'grid', gridTemplateColumns: cols, borderBottom: '1px solid ' + BORDER }}>
        {labels.map(l => (
          <div key={l} style={{ padding: '7px 11px', fontSize: '11px', fontWeight: '700', color: MID }}>{l}</div>
        ))}
      </div>
      {bands.map(b => (
        <div
          key={b.label}
          style={{
            background: b.bg,
            display: 'grid',
            gridTemplateColumns: cols,
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            outline: activeLabel === b.label ? '3px solid #fff' : 'none',
            outlineOffset: '-3px'
          }}
        >
          {getCells(b).map((cell, i) => (
            <div key={i} style={{ padding: '9px 11px', fontSize: '11px', color: '#fff', fontWeight: i === 0 ? '700' : '400', lineHeight: '1.4' }}>
              {cell}
            </div>
          ))}
        </div>
      ))}
      <div style={{ padding: '9px 13px', fontSize: '10px', color: '#666', fontStyle: 'italic', background: '#fafafa', borderTop: '1px solid ' + BORDER, lineHeight: '1.6' }}>
        This chart reflects your self-assessment only. It will be reviewed with your coach to build your Phase 2 plan.
      </div>
    </div>
  );
}

// ── SUMMARY RESULTS ───────────────────────────────────────────
export default function SummaryResults({ storage }) {
  const [tlData, setTl] = useState({});
  const [slData, setSl] = useState({});
  const [fitData, setFit] = useState({});
  const [calEst, setCal] = useState({});
  const [manualHrs, setManualHrs] = useState({});
  const [units, setUnits] = useState({ bedUnit: 'PM', wakeUnit: 'AM', fallUnit: 'min', awakeUnit: 'min' });

  useEffect(() => {
    storage.load('timelife6', {}).then(d => d && setTl(d));
    storage.load('sleep6', {}).then(d => d && setSl(d));
    storage.load('fitness6', {}).then(d => d && setFit(d));
    storage.load('calEst6', {}).then(d => d && setCal(d));
    storage.load('sleepManual6', {}).then(d => d && setManualHrs(d));
    storage.load('sleepUnits6', null).then(u => u && setUnits(u));
  });

  // ── Performance score ──────────────────────────────────────
  let totalScore = 0, daysRated = 0;
  DAYS.forEach(d => {
    const dd = tlData[d];
    if (dd && dd.rating) { totalScore += dd.rating; daysRated++; }
  });
  const perfBand = totalScore > 0
    ? PERF_BANDS.find(b => totalScore >= b.min && totalScore <= b.max) || PERF_BANDS[3]
    : null;

  // ── Sleep helpers ──────────────────────────────────────────
  function toMins(val, unit) {
    const n = parseFloat(val) || 0;
    return unit === 'hrs' ? n * 60 : n;
  }

  function calcHrs(sd) {
    if (!sd || !sd.bedtime || !sd.wakeTime) return 0;
    const bm = sd.bedtime.match(/^(\d{1,2})(?::(\d{2}))?$/);
    const wm = sd.wakeTime.match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!bm || !wm) return 0;
    let bh = parseInt(bm[1]), bmin = parseInt(bm[2] || '0');
    let wh = parseInt(wm[1]), wmin = parseInt(wm[2] || '0');
    if (units.bedUnit === 'PM' && bh !== 12) bh += 12;
    if (units.bedUnit === 'AM' && bh === 12) bh = 0;
    if (units.wakeUnit === 'PM' && wh !== 12) wh += 12;
    if (units.wakeUnit === 'AM' && wh === 12) wh = 0;
    let diff = wh * 60 + wmin - (bh * 60 + bmin);
    if (diff <= 0) diff += 1440;
    return Math.max(0, Math.round((diff - toMins(sd.fallAsleep, units.fallUnit) - toMins(sd.durationAwake, units.awakeUnit)) / 60 * 4) / 4);
  }

  // ── Sleep totals ───────────────────────────────────────────
  let totalHrs = 0, totalUp = 0, totQ = 0, qCount = 0, totalAwake = 0;
  DAYS.forEach(d => {
    const sd = slData[d];
    if (!sd) return;
    const hrs = manualHrs[d] !== undefined && manualHrs[d] !== ''
      ? parseFloat(manualHrs[d]) || 0
      : calcHrs(sd);
    totalHrs += hrs;
    if (sd.timesUp) totalUp += parseInt(sd.timesUp) || 0;
    if (sd.quality) { totQ += sd.quality; qCount++; }
    if (sd.durationAwake) totalAwake += toMins(sd.durationAwake, units.awakeUnit);
  });

  const avgQ = qCount > 0 ? (totQ / qCount).toFixed(1) + ' / 10' : '—';
  const sleepBand = totalHrs > 0
    ? SLEEP_BANDS.find(b => totalHrs >= b.minHrs) || SLEEP_BANDS[SLEEP_BANDS.length - 1]
    : null;

  // ── Calorie totals ─────────────────────────────────────────
  let totalCalIn = 0;
  DAYS.forEach(d => {
    ['am', 'midday', 'pm'].forEach(m => {
      const e = calEst[d + '_' + m];
      if (e) totalCalIn += e.cal || 0;
    });
  });

  let totalBurn = 0;
  DAYS.forEach(d => {
    const fd = fitData[d];
    if (!fd || !fd.activity) return;
    const rate = ACTIVITY_RATE[fd.activity] || 0;
    const dur = parseFloat(fd.duration) || 0;
    if (rate > 0 && dur > 0) totalBurn += Math.round(dur / 60 * rate);
  });

  return (
    <div>
      {/* ── APPENDIX A — Performance Score ── */}
      <div style={S.blockGold}>APPENDIX A — PERFORMANCE SCORE SUMMARY</div>
      <div style={S.card}>

        {/* Day grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '12px' }}>
          {DAYS.map(d => {
            const dd = tlData[d];
            const r = dd && dd.rating ? dd.rating : null;
            return (
              <div key={d} style={{
                background: r ? GOLD_LIGHT : '#f0f0f0',
                border: '1px solid ' + (r ? GOLD : BORDER),
                borderRadius: '4px', padding: '6px 2px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '9px', color: '#888', marginBottom: '1px' }}>D{d}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: r ? GOLD_DARK : '#ccc' }}>
                  {r || '—'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total score block */}
        <div style={{ background: DARK, borderRadius: '6px', padding: '16px', textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', color: '#aaa', letterSpacing: '2px', marginBottom: '4px' }}>14-DAY TOTAL</div>
          <div style={{ fontSize: '50px', fontWeight: '700', color: GOLD, lineHeight: '1' }}>{totalScore}</div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
            / 140 possible · {daysRated} of 14 days rated
          </div>
          {perfBand && (
            <div style={{ marginTop: '9px', display: 'inline-block', background: perfBand.bg, borderRadius: '4px', padding: '5px 14px', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
              {perfBand.label}
            </div>
          )}
        </div>

        {/* Performance band table */}
        <BandTable
          bands={PERF_BANDS}
          title="PERFORMANCE BAND CHART"
          cols="1fr 75px 85px 2fr"
          labels={['Performance Band', 'Daily Avg', '14-Day Total', 'Description']}
          getCells={b => [b.label, b.avg, b.min + '–' + b.max, b.desc]}
          activeLabel={perfBand?.label}
        />

        {/* Calorie summary */}
        <div style={{ ...S.blockCharcoal, borderRadius: '4px 4px 0 0', marginTop: '6px' }}>
          ESTIMATED CALORIE SUMMARY — 14 DAYS
        </div>
        <div style={{ background: '#f8f8f6', border: '1px solid ' + BORDER, borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '14px', marginBottom: '14px' }}>
          <div style={S.grid2}>
            <div style={{ background: GOLD, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: '4px' }}>ESTIMATED INTAKE</div>
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#fff' }}>{totalCalIn.toLocaleString()}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>kcal over 14 days</div>
            </div>
            <div style={{ background: STEEL, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: '4px' }}>ESTIMATED BURN</div>
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#fff' }}>{totalBurn.toLocaleString()}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>kcal over 14 days</div>
            </div>
          </div>
          <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic', marginTop: '10px', lineHeight: '1.6' }}>
            Calorie values are AI-generated estimates. For general awareness only.
          </div>
        </div>
      </div>

      {/* ── APPENDIX B — Sleep Score ── */}
      <div style={S.blockGreen}>APPENDIX B — SLEEP SCORE SUMMARY</div>
      <div style={S.card}>
        <div style={S.totalsBar}>
          <div style={S.totalsBarHdr}>14-Day Sleep Totals</div>
          <div style={S.totalsBarBody}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
              {[
                ['Total Hours', totalHrs.toFixed(1) + ' hrs'],
                ['Times Up', totalUp + ' times'],
                ['Total Awake', Math.round(totalAwake) + ' min'],
                ['Avg Quality', avgQ]
              ].map(([l, v]) => (
                <div key={l} style={S.totalsCell}>
                  <div style={S.totalsCellVal}>{v}</div>
                  <div style={S.totalsCellLbl}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '14px' }}>
          <BandTable
            bands={SLEEP_BANDS}
            title="SLEEP BAND CHART"
            cols="130px 1fr 2fr"
            labels={['14-Day Total Hours', 'Recovery Level', 'Description']}
            getCells={b => [b.minHrs === 0 ? '< 56 hrs' : '≥ ' + b.minHrs + ' hrs', b.label, b.desc]}
            activeLabel={sleepBand?.label}
          />
        </div>
      </div>
    </div>
  );
}
