import React, { useState } from 'react';
import {
  NON_NEG_CATS,
  GOLD, GOLD_LIGHT, GOLD_DARK,
  STEEL, STEEL_MID, STEEL_LIGHT,
  RED
} from '../utils/constants.js';
import { formatDayDate, startPlusDay } from '../utils/date.js';
import { S } from '../utils/styles.js';
import { Field, SaveNote, RatingButtons } from './Shared';

const WORK_OPTIONS = [
  '',
  'Work from Home',
  'Office-Based',
  'Shift Work — Day',
  'Shift Work — Night',
  'Remote / Hybrid',
  '12-Hour Shift',
  'Retired',
  '8-Hour Shift',
  'Day Off',
  'Travel Day',
  'Other'
];

export default function TimeLifeSection({
  dayData, selectedDay, onSave, startDate, onDaySelect,
  dayCompleteDates, onMarkDayComplete,
  onUnlockDay, isoForDay, isDayComplete,
}) {
  const [saved, setSaved] = useState(false);
  const [oneThingErr, setOneThingErr] = useState(false);

  const dd = dayData.timelife || {
    workHours: '', nonNegList: [], _nonNegPending: '',
    _nonNegDetail: '', screenSocial: '', screenOther: '',
    familyTimeNone: false, familyTimeHrs: '', familyTimeMins: '',
    pitHrs: '', pitMins: '', mood: '', rating: null,
    oneThing: '', yesterdayDone: false, addl: '',
  };

  function upd(k, v) {
    onSave('timelife', { ...dd, [k]: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function addNonNeg() {
    if (!dd._nonNegPending) return;
    const entry = {
      cat: dd._nonNegPending,
      detail: dd._nonNegDetail || '',
    };
    onSave('timelife', {
      ...dd,
      nonNegList: [...(dd.nonNegList || []), entry],
      _nonNegPending: '',
      _nonNegDetail: '',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!startDate) {
    return (
      <div>
        <div style={S.blockSteel}>SECTION 05 — TIME &amp; LIFE TRACKING</div>
        <div style={S.card}>
          <div style={S.infoBoxSteel}>
            Set a start date first — use the date picker at the top
            of the page. Daily entries are keyed to your start date.
          </div>
        </div>
      </div>
    );
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
            <label style={S.label}>Relationship Time</label>
            <label style={S.labelSm}>Total time with others throughout the day — enter in hours and minutes</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              margin: '6px 0',
            }}>
              <input
                type="checkbox"
                id="familyTimeNone"
                checked={dd.familyTimeNone || false}
                onChange={e => upd('familyTimeNone', e.target.checked)}
              />
              <label
                htmlFor="familyTimeNone"
                style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}
              >None</label>
            </div>
            {!dd.familyTimeNone && (
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
            )}
          </div>
          <div style={S.field}>
            <label style={S.label}>PIT (Personal Investment Time)</label>
            <label style={S.labelSm}>Time spent reading, studying, journaling, meditation, or deliberate self-development — enter in hours and minutes</label>
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

        {selectedDay > 1 && (
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
          <div style={S.addlLabel}>Additional Information — Day {selectedDay}</div>
          <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
        </div>

        <SaveNote show={saved} />

        {(() => {
          const iso = isoForDay(selectedDay);
          const isMarkedComplete =
            iso && dayCompleteDates.includes(iso);
          return (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 16,
            }}>
              {isMarkedComplete ? (
                <button
                  onClick={onUnlockDay}
                  style={{
                    background: '#333',
                    color: '#fff',
                    border: '3px solid #000',
                    borderRadius: 6,
                    padding: '10px 28px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >Unlock Day</button>
              ) : (
                <button
                  onClick={onMarkDayComplete}
                  disabled={!isDayComplete(dayData)}
                  style={{
                    background: GOLD,
                    color: '#000',
                    border: '3px solid #000',
                    borderRadius: 6,
                    padding: '10px 28px',
                    fontSize: 13,
                    fontWeight: 700,
                    opacity: isDayComplete(dayData) ? 1 : 0.4,
                    cursor: isDayComplete(dayData)
                      ? 'pointer' : 'not-allowed',
                  }}
                >Mark Day Complete</button>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
