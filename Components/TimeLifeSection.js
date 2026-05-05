import React, { useState, useEffect } from 'react';
import {
  DAYS, NON_NEG_CATS,
  GOLD, GOLD_LIGHT, GOLD_DARK,
  STEEL, STEEL_MID, STEEL_LIGHT,
  RED
} from '../utils/constants.js';
import { formatDayDate } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote, DayBtn, RatingButtons } from './Shared.js';

const WORK_OPTIONS = [
  '',
  'Work from Home',
  'Office-Based',
  'Shift Work — Day',
  'Shift Work — Night',
  'Remote / Hybrid',
  '12-Hour Shift',
  '8-Hour Shift',
  'Day Off',
  'Travel Day',
  'Other'
];

export default function TimeLifeSection({ storage, startDate }) {
  const [day, setDay] = useState(1);
  const [data, setData] = useState({});
  const [saved, setSaved] = useState(false);
  const [oneThingErr, setOneThingErr] = useState(false);

  useEffect(() => {
    storage.load('timelife6', {}).then(d => d && setData(d));
  }, []);

  function getDayData(d) {
    return data[d] || {
      workHours: '',
      nonNegList: [],
      _nonNegPending: '',
      _nonNegDetail: '',
      screenSocial: '',
      screenOther: '',
      familyTimeHrs: '',
      familyTimeMins: '',
      pitHrs: '',
      pitMins: '',
      mood: '',
      rating: null,
      oneThing: '',
      yesterdayDone: false,
      addl: ''
    };
  }

  function upd(k, v) {
    const n = { ...data, [day]: { ...getDayData(day), [k]: v } };
    setData(n);
    storage.save('timelife6', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function copyYesterday() {
    if (day <= 1) return;
    const prev = getDayData(day - 1);
    const copied = { ...prev, rating: null, oneThing: '', yesterdayDone: false, addl: '' };
    const n = { ...data, [day]: copied };
    setData(n);
    storage.save('timelife6', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function addNonNeg() {
    const current = getDayData(day);
    if (!current._nonNegPending) return;
    const entry = { cat: current._nonNegPending, detail: current._nonNegDetail || '' };
    const merged = {
      ...current,
      nonNegList: [...(current.nonNegList || []), entry],
      _nonNegPending: '',
      _nonNegDetail: ''
    };
    const n = { ...data, [day]: merged };
    setData(n);
    storage.save('timelife6', n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const filled = {};
  DAYS.forEach(d => {
    const x = data[d];
    if (x && x.rating) filled[d] = true;
  });

  const dd = getDayData(day);

  let runningTotal = 0;
  for (let d = 1; d <= day; d++) {
    const sd = data[d];
    if (sd && sd.rating) runningTotal += sd.rating;
  }

  return (
    <div>
      <div style={S.blockSteel}>SECTION 05 — TIME &amp; LIFE TRACKING</div>
      <div style={S.card}>
        <div style={S.infoBoxSteel}>
          Complete at the end of each day. PIT (Personal Investment Time) is time spent deliberately
          investing in your own growth — reading, studying, journaling, meditation, or any intentional
          self-development not covered elsewhere.
        </div>

        <div style={{ fontSize: '11px', color: '#6A6A6A', marginBottom: '7px' }}>Select a day to log:</div>
        <div style={S.dayPicker}>
          {DAYS.map(d => (
            <DayBtn key={d} day={d} active={d === day} filled={!!filled[d]} onClick={() => setDay(d)} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={S.dayTag}>{formatDayDate(startDate, day)}</div>
          {day > 1 && (
            <button style={S.copyBtn} onClick={copyYesterday}>⬆ Copy Same as Yesterday</button>
          )}
        </div>

        <Field label="Work Hours & Schedule">
          <select
            style={S.select}
            value={WORK_OPTIONS.includes(dd.workHours) ? dd.workHours : ''}
            onChange={e => upd('workHours', e.target.value)}
          >
            {WORK_OPTIONS.map(o => (
              <option key={o} value={o}>{o || 'Select work schedule...'}</option>
            ))}
          </select>
          {(!WORK_OPTIONS.includes(dd.workHours) || dd.workHours === 'Other') && (
            <input
              style={{ ...S.input, marginTop: '5px', fontSize: '12px' }}
              placeholder="Describe schedule..."
              value={dd.workHours === 'Other' ? '' : dd.workHours || ''}
              onChange={e => upd('workHours', e.target.value)}
            />
          )}
        </Field>

        <div style={S.field}>
          <label style={S.label}>Non-Negotiables</label>
          <label style={S.labelSm}>
            Personal commitments or standards you held to today. Select None if not yet established. Use Add to log multiple.
          </label>
          {(dd.nonNegList || []).map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
              background: GOLD_LIGHT, border: '1px solid ' + GOLD,
              borderRadius: '4px', padding: '6px 10px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: GOLD_DARK, flex: 1 }}>
                {item.cat}{item.detail ? ' — ' + item.detail : ''}
              </span>
              <button
                style={S.chipX}
                onClick={() => {
                  const next = (dd.nonNegList || []).filter((_, idx) => idx !== i);
                  upd('nonNegList', next);
                }}
              >×</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <select
              style={{ ...S.select, flex: '0 0 180px' }}
              value={dd._nonNegPending || ''}
              onChange={e => upd('_nonNegPending', e.target.value)}
            >
              <option value="">Select category...</option>
              {NON_NEG_CATS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              style={{ ...S.input, flex: 1 }}
              placeholder={dd._nonNegPending ? 'Describe specifically (optional)...' : ''}
              disabled={!dd._nonNegPending}
              value={dd._nonNegDetail || ''}
              onChange={e => upd('_nonNegDetail', e.target.value)}
            />
            <button style={{ ...S.copyBtn, whiteSpace: 'nowrap', flexShrink: 0 }} onClick={addNonNeg}>
              + Add
            </button>
          </div>
        </div>

        <div style={S.grid2}>
          <Field label="Screen Time — Social Media" labelSm="Time scrolling social media platforms">
            <input
              style={S.input}
              placeholder="e.g. 1 hr 30 min"
              value={dd.screenSocial || ''}
              onChange={e => upd('screenSocial', e.target.value)}
            />
          </Field>
          <Field label="Screen Time — Other" labelSm="TV, computer, or phone not related to social media">
            <input
              style={S.input}
              placeholder="e.g. 2 hrs"
              value={dd.screenOther || ''}
              onChange={e => upd('screenOther', e.target.value)}
            />
          </Field>
        </div>

        <div style={S.grid2}>
          <div style={S.field}>
            <label style={S.label}>Family Time</label>
            <label style={S.labelSm}>Total time with family throughout the day — enter in hours and minutes</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Hours</div>
                <input type="number" min="0" max="24" style={S.input} placeholder="0"
                  value={dd.familyTimeHrs || ''} onChange={e => upd('familyTimeHrs', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Minutes</div>
                <input type="number" min="0" max="59" style={S.input} placeholder="0"
                  value={dd.familyTimeMins || ''} onChange={e => upd('familyTimeMins', e.target.value)} />
              </div>
            </div>
          </div>
          <div style={S.field}>
            <label style={S.label}>PIT — Personal Investment Time</label>
            <label style={S.labelSm}>Reading, studying, journaling, meditation, deliberate self-development — enter in hours and minutes</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Hours</div>
                <input type="number" min="0" max="24" style={S.input} placeholder="0"
                  value={dd.pitHrs || ''} onChange={e => upd('pitHrs', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Minutes</div>
                <input type="number" min="0" max="59" style={S.input} placeholder="0"
                  value={dd.pitMins || ''} onChange={e => upd('pitMins', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <Field label="Mood / Stress / Notes">
          <textarea style={S.textarea} value={dd.mood || ''} onChange={e => upd('mood', e.target.value)} />
        </Field>

        <div style={S.pmBlock}>
          <div style={S.pmEyebrow}>PM CHECK-IN — HOW DID I DO TODAY?</div>
          <div style={{ fontSize: '11px', color: STEEL_LIGHT, marginBottom: '10px' }}>
            Rate your day: 1 = Poor · 10 = Outstanding
          </div>
          <RatingButtons value={dd.rating} steel onChange={v => upd('rating', v)} />
          {dd.rating && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '9px', color: '#aaa', letterSpacing: '1px', marginBottom: '2px' }}>TODAY</div>
                <div style={{ ...S.pmTotBox, fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                  {dd.rating} / 10
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#aaa', letterSpacing: '1px', marginBottom: '2px' }}>RUNNING TOTAL</div>
                <div style={{ ...S.pmTotBox, fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                  {runningTotal} / {day * 10}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ ...S.oneThingBlock, borderColor: oneThingErr ? '#ff0000' : RED }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: RED, marginBottom: '4px', letterSpacing: '0.5px' }}>
            TOMORROW'S ONE THING * <span style={{ fontSize: '10px', fontWeight: '400' }}>(Required)</span>
          </label>
          <label style={S.labelSm}>
            The single task that — by completing or starting it — makes everything else easier or unnecessary.
          </label>
          <textarea
            style={{ ...S.textarea, border: '1px solid ' + (oneThingErr ? '#ff0000' : RED), background: '#fff9f9', minHeight: '66px' }}
            placeholder="My one task for tomorrow..."
            value={dd.oneThing || ''}
            onChange={e => {
              upd('oneThing', e.target.value);
              if (e.target.value) setOneThingErr(false);
            }}
          />
          {oneThingErr && (
            <div style={{ color: RED, fontSize: '11px', marginTop: '4px' }}>
              ⚠ Tomorrow's One Thing is required to complete this day's entry.
            </div>
          )}
        </div>

        {day > 1 && (
          <div style={{
            background: STEEL_LIGHT, border: '1px solid ' + STEEL,
            borderRadius: '4px', padding: '12px 14px', marginTop: '10px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <input
              type="checkbox"
              id="ydone"
              checked={dd.yesterdayDone || false}
              onChange={e => upd('yesterdayDone', e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: STEEL, cursor: 'pointer' }}
            />
            <label htmlFor="ydone" style={{ fontSize: '12px', fontWeight: '600', color: STEEL_MID, cursor: 'pointer' }}>
              Yesterday's One Thing — Completed
            </label>
          </div>
        )}

        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information — Day {day}</div>
          <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
        </div>

        <SaveNote show={saved} />
      </div>
    </div>
  );
}
