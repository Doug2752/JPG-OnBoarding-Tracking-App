import React, { useState, useEffect } from 'react';
import { GOLD, STEEL, BG, BORDER, DARK, MID } from '../utils/constants.js';
import { startPlusDay } from '../utils/date.js';

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// "2026-07-20" -> "Jul 20". Parsed from parts to avoid timezone shifts.
function fmtShort(iso) {
  if (!iso) return '';
  const [, m, d] = String(iso).split('-');
  if (!m || !d) return '';
  return MON[parseInt(m, 10) - 1] + ' ' + parseInt(d, 10);
}

// Total minutes -> "Xh Ym"
function hm(totalMins) {
  const h = Math.floor(totalMins / 60);
  const m = Math.round(totalMins % 60);
  return h + 'h ' + m + 'm';
}

// Combine an hrs/mins field pair into "Xh Ym". Returns null when both are blank.
function pairToHm(hrs, mins) {
  const h = String(hrs ?? '').trim();
  const m = String(mins ?? '').trim();
  if (!h && !m) return null;
  return hm((parseFloat(h) || 0) * 60 + (parseFloat(m) || 0));
}

// Same pair, as raw total minutes. Returns null when both are blank.
function pairToMins(hrs, mins) {
  const h = String(hrs ?? '').trim();
  const m = String(mins ?? '').trim();
  if (!h && !m) return null;
  return (parseFloat(h) || 0) * 60 + (parseFloat(m) || 0);
}

// Sum every calEst6 entry belonging to this day number.
// NutritionSection writes "{day}_am", "{day}_midday", "{day}_pm"
// and one key per snack as "{day}_snack0", "{day}_snack1", ...
function dayCalories(calEst, dayNum) {
  const pfx = dayNum + '_';
  let total = 0;
  Object.keys(calEst || {}).forEach(k => {
    if (!k.startsWith(pfx)) return;
    const suffix = k.slice(pfx.length);
    const isMeal =
      suffix === 'am' || suffix === 'midday' || suffix === 'pm' ||
      suffix.startsWith('snack');
    if (!isMeal) return;
    const e = calEst[k];
    if (e && e.cal) total += e.cal;
  });
  return total;
}

const avg = arr =>
  arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;

// Roll one week's worth of day records into the averages block values.
function weekStats(week, calEst) {
  const sleepVals = [];
  const durVals = [];
  const calVals = [];
  const pitVals = [];
  const relVals = [];
  let activeDays = 0;
  let screenSocial = '';
  let screenOther = '';
  let screenSocialNone = false;
  let screenOtherNone = false;

  week.forEach(({ dayNum, data }) => {
    const sl = data.sleep || {};
    const th = parseFloat(sl.totalHrs);
    if (th > 0) sleepVals.push(th);

    const f = data.fitness || {};
    if (f.activity && f.activity !== '') {
      activeDays++;
      const dur = parseFloat(f.duration);
      if (dur > 0) durVals.push(dur);
    }

    const cal = dayCalories(calEst, dayNum);
    if (cal > 0) calVals.push(cal);

    const t = data.timelife || {};
    // Days iterate in ascending order, so the last hit is the most recent.
    if (t.screenSocialNone) {
      screenSocial = 'None';
    } else if (t.screenSocialHrs || t.screenSocialMins) {
      const h = t.screenSocialHrs || 0;
      const m = t.screenSocialMins || 0;
      screenSocial = `${h}h ${m}m`;
    }
    if (t.screenOtherNone) {
      screenOther = 'None';
    } else if (t.screenOtherHrs || t.screenOtherMins) {
      const h = t.screenOtherHrs || 0;
      const m = t.screenOtherMins || 0;
      screenOther = `${h}h ${m}m`;
    }

    const pit = pairToMins(t.pitHrs, t.pitMins);
    if (pit !== null) pitVals.push(pit);

    // "None" days are excluded from the relationship-time average entirely.
    if (!t.familyTimeNone) {
      const rel = pairToMins(t.familyTimeHrs, t.familyTimeMins);
      if (rel !== null) relVals.push(rel);
    }
  });

  const avgSleep = avg(sleepVals);
  const avgDur = avg(durVals);
  const avgCal = avg(calVals);
  const avgPit = avg(pitVals);
  const avgRel = avg(relVals);

  return {
    sleep: avgSleep === null ? '—' : avgSleep.toFixed(1) + ' hrs',
    activeDays: activeDays + ' of 7 days',
    duration: avgDur === null ? '—' : Math.round(avgDur) + ' min',
    calories: avgCal === null ? '—' : Math.round(avgCal).toLocaleString(),
    screenSocial: screenSocial || '—',
    screenOther: screenOther || '—',
    pit: avgPit === null ? '—' : hm(avgPit),
    rel: avgRel === null ? '—' : hm(avgRel),
  };
}

// ── STYLES ────────────────────────────────────────────────────
const weekHead = bg => ({
  background: bg,
  color: '#fff',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 2,
  padding: '11px 16px',
  borderRadius: '4px 4px 0 0',
  marginTop: 16,
});

const weekCard = {
  background: '#fff',
  border: '1px solid ' + BORDER,
  borderTop: 'none',
  borderRadius: '0 0 4px 4px',
  padding: 14,
  marginBottom: 16,
};

const statGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 8,
  marginBottom: 14,
};

const statBox = {
  background: BG,
  border: '1px solid ' + BORDER,
  borderRadius: 4,
  padding: '10px 12px',
};

const statLbl = {
  fontSize: 9,
  letterSpacing: 1,
  color: MID,
  fontWeight: 700,
  marginBottom: 3,
};

const statVal = {
  fontSize: 18,
  fontWeight: 700,
  color: DARK,
  lineHeight: 1.2,
};

const statSub = {
  fontSize: 9,
  color: '#999',
  fontStyle: 'italic',
  marginTop: 2,
};

const th = {
  background: GOLD,
  color: '#fff',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: 0.4,
  padding: '8px 9px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const td = {
  fontSize: '0.78rem',
  color: DARK,
  padding: '7px 9px',
  borderBottom: '1px solid ' + BORDER,
  whiteSpace: 'nowrap',
};

// ── DRILL-DOWN STYLES ─────────────────────────────────────────
const backBtn = {
  background: 'transparent',
  border: '1.5px solid ' + DARK,
  borderRadius: 4,
  color: DARK,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.5,
  padding: '6px 14px',
  cursor: 'pointer',
  marginBottom: 12,
  display: 'inline-block',
};

const dayRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderBottom: '1px solid ' + BORDER,
  cursor: 'pointer',
  background: '#fff',
};

const detailRowStyle = {
  display: 'flex',
  padding: '8px 0',
  borderBottom: '1px solid ' + BORDER,
  fontSize: 13,
};

const detailLbl = {
  flex: '0 0 180px',
  fontSize: 11,
  fontWeight: 700,
  color: MID,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
};

const detailVal = {
  flex: 1,
  fontSize: 13,
  color: DARK,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const Stat = ({ label, value, sub }) => (
  <div style={statBox}>
    <div style={statLbl}>{label}</div>
    <div style={statVal}>{value}</div>
    {sub && <div style={statSub}>{sub}</div>}
  </div>
);

// ── DAY GRID ──────────────────────────────────────────────────
function DayGrid({ week, calEst }) {
  const cols = [
    'Day', 'Sleep Hrs', 'Activity', 'Duration', 'Calories',
    'Screen Social', 'Screen Other', 'PIT', 'Relationship',
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        borderCollapse: 'collapse',
        width: 'max-content',
        minWidth: '100%',
      }}>
        <thead>
          <tr>
            {cols.map(c => <th key={c} style={th}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {week.map(({ dayNum, iso, data }, i) => {
            const sl = data.sleep || {};
            const f = data.fitness || {};
            const t = data.timelife || {};

            const hrs = parseFloat(sl.totalHrs);
            const sleepCell = hrs > 0 ? hrs.toFixed(1) : '—';

            let actCell = '—';
            if (f.activity && f.activity !== '') {
              actCell = f.activity === 'Other — Write In'
                ? (String(f.activityOther || '').trim() || 'Other — Write In')
                : f.activity;
            }

            const dur = parseFloat(f.duration);
            const durCell = dur > 0 ? dur + ' min' : '—';

            const cal = dayCalories(calEst, dayNum);
            const calCell = cal > 0 ? cal.toLocaleString() : '—';

            const socialCell = t.screenSocialNone ? 'None' : (t.screenSocialHrs || t.screenSocialMins) ? `${t.screenSocialHrs || 0}h ${t.screenSocialMins || 0}m` : '—';
            const otherCell = t.screenOtherNone ? 'None' : (t.screenOtherHrs || t.screenOtherMins) ? `${t.screenOtherHrs || 0}h ${t.screenOtherMins || 0}m` : '—';

            const pitCell = pairToHm(t.pitHrs, t.pitMins) || '—';

            let relCell = '—';
            if (t.familyTimeNone) relCell = 'None';
            else relCell = pairToHm(t.familyTimeHrs, t.familyTimeMins) || '—';

            return (
              <tr key={dayNum} style={{ background: i % 2 === 0 ? '#fff' : BG }}>
                <td style={td}>
                  <div style={{ fontWeight: 700 }}>Day {dayNum}</div>
                  <div style={{ fontSize: '0.68rem', color: '#999' }}>
                    {fmtShort(iso)}
                  </div>
                </td>
                <td style={td}>{sleepCell}</td>
                <td style={{ ...td, whiteSpace: 'normal', minWidth: 130 }}>{actCell}</td>
                <td style={td}>{durCell}</td>
                <td style={td}>{calCell}</td>
                <td style={td}>{socialCell}</td>
                <td style={td}>{otherCell}</td>
                <td style={td}>{pitCell}</td>
                <td style={td}>{relCell}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── WEEK SECTION ──────────────────────────────────────────────
function WeekSection({ title, bg, week, calEst, onHeaderClick }) {
  const s = weekStats(week, calEst);
  return (
    <div>
      {onHeaderClick ? (
        <button
          onClick={onHeaderClick}
          style={{
            ...weekHead(bg),
            color: '#000',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            border: 'none',
            display: 'block',
          }}
        >
          {title}
        </button>
      ) : (
        <div style={weekHead(bg)}>{title}</div>
      )}
      <div style={weekCard}>
        <div style={statGrid}>
          <Stat label="AVG SLEEP HOURS" value={s.sleep} />
          <Stat label="DAYS ACTIVE" value={s.activeDays} />
          <Stat label="AVG DURATION" value={s.duration} sub="Active days only" />
          <Stat label="AVG DAILY CALORIES" value={s.calories} />
          <Stat label="SCREEN TIME — SOCIAL" value={s.screenSocial} sub="Most recent entry" />
          <Stat label="SCREEN TIME — OTHER" value={s.screenOther} sub="Most recent entry" />
          <Stat label="AVG PIT TIME" value={s.pit} />
          <Stat label="AVG RELATIONSHIP TIME" value={s.rel} />
        </div>
      </div>
    </div>
  );
}

// ── DAY DETAIL VIEW ───────────────────────────────────────────
function DayDetail({ dayEntry, calEst, onBack }) {
  if (!dayEntry) return null;
  const { dayNum, iso, data } = dayEntry;
  const sl = data.sleep || {};
  const f = data.fitness || {};
  const n = data.nutrition || {};
  const a = data.alcohol || {};
  const t = data.timelife || {};

  const cal = dayCalories(calEst, dayNum);

  let alcoholStr = '—';
  if (a.alcoholNone) {
    alcoholStr = 'None';
  } else {
    const parts = [];
    if (a.beer && String(a.beer).trim()) parts.push('Beer: ' + a.beer);
    if (a.mixed && String(a.mixed).trim()) parts.push('Mixed: ' + a.mixed);
    if (a.otherAlc && String(a.otherAlc).trim()) parts.push('Other: ' + a.otherAlc);
    if (parts.length) alcoholStr = parts.join(' · ');
  }

  const nonNegStr = (t.nonNegList || []).length > 0
    ? (t.nonNegList || []).map(item =>
        item.cat + (item.detail ? ': ' + item.detail : '')
      ).join(', ')
    : '—';

  const screenSocialStr = t.screenSocialNone ? 'None'
    : pairToHm(t.screenSocialHrs, t.screenSocialMins) || '—';
  const screenOtherStr = t.screenOtherNone ? 'None'
    : pairToHm(t.screenOtherHrs, t.screenOtherMins) || '—';
  const pitStr = t.pitNone ? 'None'
    : pairToHm(t.pitHrs, t.pitMins) || '—';
  const relStr = t.familyTimeNone ? 'None'
    : pairToHm(t.familyTimeHrs, t.familyTimeMins) || '—';

  let actStr = '—';
  if (f.activity && f.activity !== '') {
    actStr = f.activity === 'Other — Write In'
      ? (String(f.activityOther || '').trim() || 'Other')
      : f.activity;
    if (f.duration) actStr += ' · ' + f.duration + ' min';
    if (f.intensity) actStr += ' · RPE ' + f.intensity;
  }

  const Row = ({ label, value }) => (
    <div style={detailRowStyle}>
      <div style={detailLbl}>{label}</div>
      <div style={detailVal}>{value || '—'}</div>
    </div>
  );

  const SectionHead = ({ label, color }) => (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1.5,
      color: color || MID,
      textTransform: 'uppercase',
      marginTop: 18,
      marginBottom: 4,
      paddingBottom: 4,
      borderBottom: '2px solid ' + (color || MID),
    }}>
      {label}
    </div>
  );

  return (
    <div>
      <button style={backBtn} onClick={onBack}>← BACK TO WEEK LIST</button>
      <div style={{ fontWeight: 700, fontSize: 18, color: DARK, marginBottom: 2 }}>
        Day {dayNum}
      </div>
      <div style={{ fontSize: 12, color: MID, marginBottom: 14 }}>{fmtShort(iso)}</div>

      <div style={{ background: '#fff', border: '1px solid ' + BORDER, borderRadius: 4, padding: '4px 16px 16px 16px' }}>
        <SectionHead label="Sleep" color="#2E5A4B" />
        <Row label="Bedtime" value={sl.bedtime || '—'} />
        <Row label="Wake Time" value={sl.wakeTime || '—'} />
        <Row label="Hours Slept" value={sl.totalHrs ? sl.totalHrs + ' hrs' : '—'} />
        <Row label="Sleep Score" value={sl.sleepScore ? String(sl.sleepScore) : '—'} />
        <Row label="Sleep Quality" value={sl.quality ? sl.quality + ' / 10' : '—'} />
        <Row label="Weight" value="—" />
        <Row label="Energy Level" value="—" />
        <Row label="Location" value="—" />

        <SectionHead label="Fitness" color="#7A4418" />
        <Row label="Activity" value={actStr} />

        <SectionHead label="Nutrition" color="#7B3055" />
        <Row label="Calories" value={cal > 0 ? cal.toLocaleString() + ' kcal' : '—'} />
        <Row label="AM Meal" value={n.am || '—'} />
        <Row label="Midday Meal" value={n.midday || '—'} />
        <Row label="PM Meal" value={n.pm || '—'} />

        <SectionHead label="Alcohol" color="#4A3575" />
        <Row label="Alcohol" value={alcoholStr} />

        <SectionHead label="Time & Life" color="#3A5A78" />
        <Row label="Screen Time — Social" value={screenSocialStr} />
        <Row label="Screen Time — Other" value={screenOtherStr} />
        <Row label="PIT Time" value={pitStr} />
        <Row label="Relationship Time" value={relStr} />
        <Row label="Day Rating" value={t.rating ? t.rating + ' / 10' : '—'} />
        <Row label="Tomorrow's One Thing" value={t.oneThing || '—'} />
        <Row label="Non-Negotiables" value={nonNegStr} />
      </div>
    </div>
  );
}

// ── SUMMARY RESULTS ───────────────────────────────────────────
export default function SummaryResults({ storage, startDate }) {
  const [days, setDays] = useState([]);
  const [calEst, setCalEst] = useState({});
  const [loading, setLoading] = useState(true);
  const [drillWeek, setDrillWeek] = useState(null);
  const [drillDay, setDrillDay] = useState(null);

  useEffect(() => {
    if (!startDate || !storage) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    const nums = Array.from({ length: 14 }, (_, i) => i + 1);
    const loads = nums.map(dayNum => {
      const iso = startPlusDay(startDate, dayNum);
      if (!iso) return Promise.resolve({ dayNum, iso: null, data: {} });
      return storage.loadDay(iso, {}).then(d => ({
        dayNum, iso, data: d || {},
      }));
    });

    Promise.all([storage.load('calEst6', {}), Promise.all(loads)])
      .then(([cal, rows]) => {
        if (cancelled) return;
        setCalEst(cal || {});
        setDays(rows);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  if (!startDate) {
    return (
      <div style={{
        padding: 40,
        textAlign: 'center',
        color: MID,
        fontSize: 14,
      }}>
        Set a start date in the Client Info tab to view Summary Results.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        padding: 40,
        textAlign: 'center',
        color: MID,
        fontSize: 13,
      }}>
        Loading…
      </div>
    );
  }

  const week1 = days.filter(d => d.dayNum <= 7);
  const week2 = days.filter(d => d.dayNum >= 8);

  // ── Day detail view ──────────────────────────────────────────
  if (drillDay !== null) {
    const entry = days.find(d => d.iso === drillDay);
    return (
      <div style={{ padding: '0 0 24px 0' }}>
        <DayDetail
          dayEntry={entry}
          calEst={calEst}
          onBack={() => setDrillDay(null)}
        />
      </div>
    );
  }

  // ── Week list view ───────────────────────────────────────────
  if (drillWeek !== null) {
    const weekDays = drillWeek === 1 ? week1 : week2;
    const weekColor = drillWeek === 1 ? GOLD : STEEL;
    const weekLabel = drillWeek === 1 ? 'WEEK 1 — DAYS 1–7' : 'WEEK 2 — DAYS 8–14';
    return (
      <div style={{ padding: '0 0 24px 0' }}>
        <button
          style={backBtn}
          onClick={() => { setDrillWeek(null); setDrillDay(null); }}
        >
          ← BACK
        </button>
        <div style={{ ...weekHead(weekColor), marginTop: 0 }}>{weekLabel}</div>
        <div style={{
          background: '#fff',
          border: '1px solid ' + BORDER,
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
        }}>
          {weekDays.map(({ dayNum, iso, data }) => {
            const hasData = data && Object.keys(data).length > 0;
            return (
              <div
                key={dayNum}
                style={{
                  ...dayRowStyle,
                  opacity: hasData ? 1 : 0.45,
                  cursor: hasData && iso ? 'pointer' : 'default',
                }}
                onClick={() => { if (hasData && iso) setDrillDay(iso); }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: DARK }}>Day {dayNum}</div>
                  <div style={{ fontSize: 11, color: MID }}>{fmtShort(iso) || '—'}</div>
                </div>
                {hasData && (
                  <div style={{ fontSize: 11, color: weekColor, fontWeight: 700 }}>VIEW →</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Default view — both weeks ────────────────────────────────
  return (
    <div>
      <WeekSection
        title="VIEW DAYS 1–7 — Click to view full detail"
        bg={GOLD}
        week={week1}
        calEst={calEst}
        onHeaderClick={() => { setDrillWeek(1); setDrillDay(null); }}
      />
      <WeekSection
        title="VIEW DAYS 8–14 — Click to view full detail"
        bg={STEEL}
        week={week2}
        calEst={calEst}
        onHeaderClick={() => { setDrillWeek(2); setDrillDay(null); }}
      />
    </div>
  );
}
