import React, { useState, useEffect } from 'react';
import { DAYS, GREEN } from '../utils/constants.js';
import { formatDayDate } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote, DayBtn, RatingButtons, InputWithToggle, SleepFieldCol } from './Shared.js';

export default function SleepSection({ storage, startDate }) {
  const [day, setDay] = useState(1);
  const [data, setData] = useState({});
  const [saved, setSaved] = useState(false);
  const [manualHrs, setManualHrs] = useState({});

  // Global unit toggles — pre-staged defaults, persist across all 14 days
  const [bedUnit, setBedUnit] = useState('PM');
  const [wakeUnit, setWakeUnit] = useState('AM');
  const [fallUnit, setFallUnit] = useState('min');
  const [awakeUnit, setAwakeUnit] = useState('min');

  useEffect(() => {
    storage.load('sleep6', {}).then(d => d && setData(d));
    storage.load('sleepManual6', {}).then(d => d && setManualHrs(d));
    storage.load('sleepUnits6', null).then(u => {
      if (u) {
        if (u.bedUnit) setBedUnit(u.bedUnit);
        if (u.wakeUnit) setWakeUnit(u.wakeUnit);
        if (u.fallUnit) setFallUnit(u.fallUnit);
        if (u.awakeUnit) setAwakeUnit(u.awakeUnit);
      }
    });
  }, []);

  function saveUnits(b, w, f, a) {
    storage.save('sleepUnits6', { bedUnit: b, wakeUnit: w, fallUnit: f, awakeUnit: a });
  }

  function toggleBed() {
    const n = bedUnit === 'PM' ? 'AM' : 'PM';
    setBedUnit(n);
    saveUnits(n, wakeUnit, fallUnit, awakeUnit);
  }
  function toggleWake() {
    const n = wakeUnit === 'AM' ? 'PM' : 'AM';
    setWakeUnit(n);
    saveUnits(bedUnit, n, fallUnit, awakeUnit);
  }
  function toggleFall() {
    const n = fallUnit === 'min' ? 'hrs' : 'min';
    setFallUnit(n);
    saveUnits(bedUnit, wakeUnit, n, awakeUnit);
  }
  function toggleAwake() {
    const n = awakeUnit === 'min' ? 'hrs' : 'min';
    setAwakeUnit(n);
    saveUnits(bedUnit, wakeUnit, fallUnit, n);
  }

  function getDayData(d) {
    return data[d] || {
      bedtime: '', fallAsleep: '', wakeTime: '', timesUp: '',
      durationAwake: '', quality: null, sleepScore: '', environment: '', addl: ''
    };
  }

  function upd(k, v) {
    const n = { ...data, [day]: { ...getDayData(day), [k]: v } };
    setData(n);
    storage.save('sleep6', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function updManual(v) {
    const n = { ...manualHrs, [day]: v };
    setManualHrs(n);
    storage.save('sleepManual6', n);
  }

  function timeToMins(timeStr, unit) {
    if (!timeStr) return null;
    const m = timeStr.match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!m) return null;
    let hr = parseInt(m[1]);
    const mn = parseInt(m[2] || '0');
    if (unit === 'PM' && hr !== 12) hr += 12;
    if (unit === 'AM' && hr === 12) hr = 0;
    return hr * 60 + mn;
  }

  function toMins(val, unit) {
    const n = parseFloat(val) || 0;
    return unit === 'hrs' ? n * 60 : n;
  }

  function calcTotalHrs(dd) {
    const bedM = timeToMins(dd.bedtime, bedUnit);
    const wakeM = timeToMins(dd.wakeTime, wakeUnit);
    if (bedM === null || wakeM === null) return 0;
    let diff = wakeM - bedM;
    if (diff <= 0) diff += 24 * 60;
    const fallM = toMins(dd.fallAsleep, fallUnit);
    const awakeM = toMins(dd.durationAwake, awakeUnit);
    return Math.max(0, Math.round((diff - fallM - awakeM) / 60 * 4) / 4);
  }

  const filled = {};
  DAYS.forEach(d => {
    const x = data[d];
    if (x && x.bedtime) filled[d] = true;
  });

  const dd = getDayData(day);
  const autoHrs = calcTotalHrs(dd);
  const displayHrs = manualHrs[day] !== undefined && manualHrs[day] !== ''
    ? manualHrs[day]
    : autoHrs > 0 ? autoHrs : '';

  // 14-day totals
  let totalHrs = 0, totalUp = 0, totQ = 0, qCount = 0, totalAwake = 0, totalFall = 0, fallCount = 0;
  DAYS.forEach(d => {
    const sd = data[d];
    if (!sd) return;
    const hrs = manualHrs[d] !== undefined && manualHrs[d] !== ''
      ? parseFloat(manualHrs[d]) || 0
      : calcTotalHrs(sd);
    totalHrs += hrs;
    if (sd.timesUp) totalUp += parseInt(sd.timesUp) || 0;
    if (sd.quality) { totQ += sd.quality; qCount++; }
    if (sd.durationAwake) totalAwake += toMins(sd.durationAwake, awakeUnit);
    if (sd.fallAsleep) { totalFall += toMins(sd.fallAsleep, fallUnit); fallCount++; }
  });

  const avgQ = qCount > 0 ? (totQ / qCount).toFixed(1) + ' / 10' : '—';
  const avgFall = fallCount > 0 ? Math.round(totalFall / fallCount) + ' min' : '—';

  const inputSm = { ...S.input, fontSize: '12px', padding: '7px 8px' };
  const rowStyle = { display: 'grid', gap: '10px', marginBottom: '10px' };

  return (
    <div>
      <div style={S.blockGreen}>SECTION 04 — SLEEP TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBoxGreen}>
          Enter bedtime, time to fall asleep, and wake time. Total Sleep Hours is auto-calculated.
          Units are pre-set to the most common values — tap the unit button to change if needed.
          Sleep and sleep quality are among the most underrated factors in human performance. This data is critical.
        </div>

        <div style={{ fontSize: '11px', color: '#6A6A6A', marginBottom: '7px' }}>Select a day to log:</div>
        <div style={S.dayPicker}>
          {DAYS.map(d => (
            <DayBtn key={d} day={d} active={d === day} filled={!!filled[d]} onClick={() => setDay(d)} />
          ))}
        </div>

        <div style={S.dayTag}>{formatDayDate(startDate, day)}</div>

        <div style={{ ...rowStyle, gridTemplateColumns: '1fr 1fr' }}>
          <SleepFieldCol label="Bedtime" labelSm="Time you got into bed">
            <InputWithToggle
              value={dd.bedtime}
              placeholder="9:30"
              onChange={e => upd('bedtime', e.target.value)}
              unitLabel={bedUnit}
              onToggle={toggleBed}
            />
          </SleepFieldCol>
          <SleepFieldCol label="Time to Fall Asleep" labelSm="How long until asleep">
            <InputWithToggle
              type="number"
              value={dd.fallAsleep}
              placeholder="15"
              onChange={e => upd('fallAsleep', e.target.value)}
              unitLabel={fallUnit}
              onToggle={toggleFall}
            />
          </SleepFieldCol>
        </div>

        <div style={{ ...rowStyle, gridTemplateColumns: '1fr 1fr' }}>
          <SleepFieldCol label="Wake Time" labelSm="Time you got out of bed">
            <InputWithToggle
              value={dd.wakeTime}
              placeholder="5:00"
              onChange={e => upd('wakeTime', e.target.value)}
              unitLabel={wakeUnit}
              onToggle={toggleWake}
            />
          </SleepFieldCol>
          <SleepFieldCol label="Total Sleep Hours" labelSm="Auto-calculated — or enter manually">
            <input
              type="number"
              step="0.25"
              min="0"
              max="24"
              style={{
                ...inputSm,
                background: manualHrs[day] ? '#fff9e6' : '#f8f8f6',
                fontWeight: '600',
                width: '100%'
              }}
              placeholder={autoHrs > 0 ? String(autoHrs) : '0.0'}
              value={displayHrs}
              onChange={e => updManual(e.target.value)}
            />
          </SleepFieldCol>
        </div>

        <div style={{ ...rowStyle, gridTemplateColumns: '1fr 1fr 1fr' }}>
          <SleepFieldCol label="Times Up at Night" labelSm="Number of times woken">
            <input
              type="number"
              min="0"
              style={{ ...inputSm, width: '100%' }}
              value={dd.timesUp || ''}
              onChange={e => upd('timesUp', e.target.value)}
            />
          </SleepFieldCol>
          <SleepFieldCol label="Awake Duration" labelSm="Total time awake across all interruptions">
            <InputWithToggle
              type="number"
              value={dd.durationAwake}
              placeholder="0"
              onChange={e => upd('durationAwake', e.target.value)}
              unitLabel={awakeUnit}
              onToggle={toggleAwake}
            />
          </SleepFieldCol>
          <SleepFieldCol label="Sleep Score (1–100)" labelSm="Wearable or app">
            <input
              type="number"
              min="1"
              max="100"
              style={{ ...inputSm, width: '100%' }}
              placeholder="Optional"
              value={dd.sleepScore || ''}
              onChange={e => {
                const v = Math.min(100, Math.max(1, parseInt(e.target.value) || 0));
                upd('sleepScore', v || '');
              }}
            />
          </SleepFieldCol>
        </div>

        <Field
          label="Sleep Environment"
          labelSm="TV / Radio / White Noise / Silence / Alone / With Others — write SAME if unchanged"
        >
          <textarea
            style={{ ...S.textarea, minHeight: '60px' }}
            value={dd.environment || ''}
            onChange={e => upd('environment', e.target.value)}
          />
        </Field>

        <Field label="Sleep Quality 1–10">
          <RatingButtons value={dd.quality} onChange={v => upd('quality', v)} />
        </Field>

        <div style={S.totalsBar}>
          <div style={S.totalsBarHdr}>14-Day Totals</div>
          <div style={S.totalsBarBody}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '6px' }}>
              {[
                ['Total Hrs', totalHrs.toFixed(1) + ' hrs'],
                ['Times Up', totalUp + ' times'],
                ['Total Awake', Math.round(totalAwake) + ' min'],
                ['Avg Quality', avgQ],
                ['Avg Fall', avgFall]
              ].map(([l, v]) => (
                <div key={l} style={S.totalsCell}>
                  <div style={S.totalsCellVal}>{v}</div>
                  <div style={S.totalsCellLbl}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information — Day {day}</div>
          <textarea
            style={S.textarea}
            value={dd.addl || ''}
            onChange={e => upd('addl', e.target.value)}
          />
        </div>

        <SaveNote show={saved} />
      </div>
    </div>
  );
}
