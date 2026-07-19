import React, { useState, useEffect } from 'react';
import { GOLD } from '../utils/constants.js';
import { formatDayDate, startPlusDay } from '../utils/date.js';
import { S } from '../utils/styles.js';
import {
  Field, SaveNote, RatingButtons, InputWithToggle, SleepFieldCol,
} from './Shared';

export default function SleepSection({
  storage, dayData, selectedDay, onSave, startDate, onDaySelect,
}) {
  const [saved, setSaved] = useState(false);
  const [manualHrs, setManualHrs] = useState({});

  // Global unit toggles — persist across all days via storage
  const [bedUnit, setBedUnit] = useState('PM');
  const [wakeUnit, setWakeUnit] = useState('AM');
  const [fallUnit, setFallUnit] = useState('min');
  const [awakeUnit, setAwakeUnit] = useState('min');

  useEffect(() => {
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
    storage.save('sleepUnits6', {
      bedUnit: b, wakeUnit: w, fallUnit: f, awakeUnit: a,
    });
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

  const dd = dayData.sleep || {
    bedtime: '', fallAsleep: '', wakeTime: '', timesUp: '',
    durationAwake: '', quality: null, sleepScore: null,
    environment: '', addl: '',
  };

  function upd(k, v) {
    onSave('sleep', { ...dd, [k]: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function updManual(v) {
    const n = { ...manualHrs, [selectedDay]: v };
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

  function calcTotalHrs(dv) {
    const bedM = timeToMins(dv.bedtime, bedUnit);
    const wakeM = timeToMins(dv.wakeTime, wakeUnit);
    if (bedM === null || wakeM === null) return 0;
    let diff = wakeM - bedM;
    if (diff <= 0) diff += 24 * 60;
    const fallM = toMins(dv.fallAsleep, fallUnit);
    const awakeM = toMins(dv.durationAwake, awakeUnit);
    return Math.max(0, Math.round((diff - fallM - awakeM) / 60 * 4) / 4);
  }

  const autoHrs = calcTotalHrs(dd);
  const displayHrs =
    manualHrs[selectedDay] !== undefined && manualHrs[selectedDay] !== ''
      ? manualHrs[selectedDay]
      : autoHrs > 0 ? autoHrs : '';

  const inputSm = { ...S.input, fontSize: '12px', padding: '7px 8px' };
  const rowStyle = { display: 'grid', gap: '10px', marginBottom: '10px' };

  if (!startDate) {
    return (
      <div>
        <div style={S.blockGreen}>SECTION 04 — SLEEP TRACKING</div>
        <div style={S.card}>
          <div style={S.infoBoxGreen}>
            Set a start date first — use the date picker at the top
            of the page. Daily entries are keyed to your start date.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={S.blockGreen}>SECTION 04 — SLEEP TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBoxGreen}>
          Enter bedtime, time to fall asleep, and wake time. Total Sleep Hours is auto-calculated.
          Units are pre-set to the most common values — tap the unit button to change if needed.
          Sleep and sleep quality are among the most underrated factors in human performance. This data is critical.
        </div>

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
                background: manualHrs[selectedDay] ? '#fff9e6' : '#f8f8f6',
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

        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information — Day {selectedDay}</div>
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
