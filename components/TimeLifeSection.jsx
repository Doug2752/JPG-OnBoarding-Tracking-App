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
  { value: 'Retired', label: 'Retired' },
  { value: 'Work from Home', label: 'Work from Home' },
  { value: 'Office-Based', label: 'Office-Based' },
  { value: 'Shift Work — Day', label: 'Shift Work — Day' },
  { value: 'Shift Work — Night', label: 'Shift Work — Night' },
  { value: 'Remote / Hybrid', label: 'Remote / Hybrid' },
  { value: 'Day Off', label: 'Day Off' },
  { value: 'Travel Day', label: 'Travel Day' },
  { value: 'Other', label: 'Other' }
];

export default function TimeLifeSection({
  dayData, selectedDay, onSave, startDate, onDaySelect,
  dayCompleteDates, onMarkDayComplete,
  onUnlockDay, isoForDay, isDayComplete, dayComplete, attempted,
  w1Submitted, w2Submitted, w1Sent, w2Sent, onSubmitToCoach,
}) {
  const [saved, setSaved] = useState(false);

  const dd = dayData.timelife || {
    workSchedule: '', workHoursNum: '', nonNegList: [], _nonNegPending: '',
    screenSocialHrs: '', screenSocialMins: '', screenSocialNone: false,
    screenOtherHrs: '', screenOtherMins: '', screenOtherNone: false,
    familyTimeNone: false, familyTimeHrs: '', familyTimeMins: '',
    pitHrs: '', pitMins: '', pitNone: false, mood: '', rating: null,
    oneThing: '', addl: '',
  };

  const oneThingMissing = attempted && (!dd.oneThing || !dd.oneThing.trim());
  const nonNegMissing = attempted && (!dd.nonNegList || dd.nonNegList.length === 0);
  const screenSocialMissing = attempted && !dd.screenSocialNone && !dd.screenSocialHrs && !dd.screenSocialMins;
  const screenOtherMissing = attempted && !dd.screenOtherNone && !dd.screenOtherHrs && !dd.screenOtherMins;
  const ratingMissing = attempted && !dd.rating;
  const workHoursMissing = attempted && dd.workSchedule !== 'Retired' && !dd.workHoursNum && dd.workHoursNum !== 0;

  const n = dayData.nutrition || {};
  const nutritionMissing = attempted && (!n.am || !n.midday || !n.pm);
  const a = dayData.alcohol || {};
  const alcoholMissing = attempted && !(
    a.alcoholNone === true ||
    (a.beer && String(a.beer).trim()) ||
    (a.mixed && String(a.mixed).trim()) ||
    (a.otherAlc && String(a.otherAlc).trim())
  );
  const f = dayData.fitness || {};
  const fitnessMissing = attempted && f.activity && f.activity !== '' && f.activity !== 'None' && f.activity !== 'Rest' && (!f.duration || !f.intensity);
  const sl = dayData.sleep || {};
  const sleepMissing = attempted && (
    !sl.bedtime || !sl.fallAsleep || !sl.wakeTime ||
    !sl.timesUp || !sl.durationAwake || !sl.quality
  );

  const errorLines = [];
  if (nutritionMissing) errorLines.push('Nutrition — AM, Midday, and PM meals required');
  if (alcoholMissing) errorLines.push('Alcohol — at least one field required');
  if (fitnessMissing) errorLines.push('Fitness — Duration and Intensity required when activity selected (not required for None or Rest)');
  if (sleepMissing) errorLines.push('Sleep — all time and quality fields required');
  if (nonNegMissing) errorLines.push('Time & Life — at least one Non-Negotiable required');
  if (screenSocialMissing) errorLines.push('Time & Life — Screen Time Social Media required');
  if (screenOtherMissing) errorLines.push('Time & Life — Screen Time Other required');
  if (ratingMissing) errorLines.push('Time & Life — PM Check-In rating required');
  if (oneThingMissing) errorLines.push("Time & Life — Tomorrow's One Thing required");
  if (workHoursMissing) errorLines.push('Time & Life — Work Hours required');

  function upd(k, v) {
    onSave('timelife', { ...dd, [k]: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!startDate) {
    return (
      <div>
        <div style={S.blockSteel}>SECTION 05 — TIME &amp; LIFE TRACKING</div>
        <div style={S.card}>
          <div style={S.infoBoxSteel}>
            Your start date has not been set yet. Return to the Home screen and tap Start Today's Entry to begin, or enter your start date on the Client Info page.
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

        {dayComplete && (
          <div style={{ background: STEEL, color: '#fff', fontSize: 11, fontWeight: 700, textAlign: 'center', padding: 4, borderRadius: 4, marginBottom: 8 }}>
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
                cursor: 'pointer', background: active ? STEEL : '#333', color: '#fff', lineHeight: 1.2,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Day {n}</span>
                <span style={{ fontSize: 9, fontWeight: 400 }}>{lbl}</span>
              </button>
            );
          })}
        </div>
        <div style={S.dayTagSteel}>{formatDayDate(startDate, selectedDay)}</div>

        <Field label="Work Schedule">
          <select
            style={S.select}
            value={WORK_OPTIONS.some(o => o.value === dd.workSchedule) ? dd.workSchedule : ''}
            onChange={e => upd('workSchedule', e.target.value)}
          >
            <option value="">Select work schedule...</option>
            {WORK_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {(dd.workSchedule && !WORK_OPTIONS.some(o => o.value === dd.workSchedule) || dd.workSchedule === 'Other') && (
            <input
              style={{ ...S.input, marginTop: '5px', fontSize: '12px' }}
              placeholder="Describe schedule..."
              value={dd.workSchedule === 'Other' ? '' : dd.workSchedule || ''}
              onChange={e => upd('workSchedule', e.target.value)}
            />
          )}
        </Field>

        {dd.workSchedule !== 'Retired' && (
          <Field label="Work Hours — hours worked today">
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              style={{ ...S.input, border: workHoursMissing ? '2px solid #cc0000' : undefined }}
              placeholder="e.g. 8"
              value={dd.workHoursNum ?? ''}
              onChange={e => upd('workHoursNum', e.target.value)}
            />
            {workHoursMissing && (
              <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>Work Hours is required.</div>
            )}
          </Field>
        )}

        <div style={S.field}>
          <label style={S.label}>Non-Negotiables{(dd.nonNegList || []).length > 0 && <span style={{ color: STEEL, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
          <label style={S.labelSm}>
            Personal commitments or standards you held to today. Select None if not yet established. Use Select Category to log multiple.
          </label>
          {(dd.nonNegList || []).map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
              background: STEEL_LIGHT, border: '1px solid ' + STEEL,
              borderRadius: '4px', padding: '6px 10px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: STEEL, flex: '0 0 auto' }}>
                {item.cat}
              </span>
              <input
                placeholder="Note (optional)"
                value={item.detail || ''}
                disabled={dayComplete}
                style={{ flex: 1, fontSize: 11, padding: '3px 6px', borderRadius: 3, border: '1px solid #ccc', background: '#fff' }}
                onChange={e => {
                  const next = (dd.nonNegList || []).map((it, idx) =>
                    idx === i ? { ...it, detail: e.target.value } : it
                  );
                  onSave('timelife', { ...dd, nonNegList: next });
                }}
              />
              <button
                disabled={dayComplete}
                style={{ ...S.chipX, opacity: dayComplete ? 0.4 : 1, cursor: dayComplete ? 'not-allowed' : 'pointer' }}
                onClick={() => {
                  const next = (dd.nonNegList || []).filter((_, idx) => idx !== i);
                  upd('nonNegList', next);
                }}
              >×</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <select
              style={{ ...S.select, flex: '0 0 160px', border: nonNegMissing ? '2px solid #cc0000' : undefined }}
              value={dd._nonNegPending || ''}
              disabled={dayComplete}
              onChange={e => {
                const cat = e.target.value;
                if (!cat) return;
                const entry = { cat, detail: '' };
                onSave('timelife', {
                  ...dd,
                  nonNegList: [...(dd.nonNegList || []), entry],
                  _nonNegPending: '',
                });
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
            >
              <option value="">Select category...</option>
              {NON_NEG_CATS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {nonNegMissing && (
            <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>Required</div>
          )}
        </div>

        <div style={S.grid2}>
          <div style={S.field}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ ...S.label, flex: '0 0 220px' }}>Screen Time — Social Media{(dd.screenSocialNone || dd.screenSocialHrs || dd.screenSocialMins) && <span style={{ color: STEEL, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  id="screenSocialNone"
                  style={{ accentColor: STEEL }}
                  checked={dd.screenSocialNone || false}
                  disabled={dayComplete}
                  onChange={e => upd('screenSocialNone', e.target.checked)}
                />
                <label htmlFor="screenSocialNone" style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>None</label>
              </div>
            </div>
            <label style={S.labelSm}>Time scrolling social media platforms</label>
            {!dd.screenSocialNone && (
              <div style={{ display: 'flex', gap: '8px', border: screenSocialMissing ? '2px solid #cc0000' : undefined }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Hours</div>
                  <input type="number" min="0" max="24" style={S.input} placeholder="0"
                    value={dd.screenSocialHrs || ''} onChange={e => upd('screenSocialHrs', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Minutes</div>
                  <input type="number" min="0" max="59" style={S.input} placeholder="0"
                    value={dd.screenSocialMins || ''} onChange={e => upd('screenSocialMins', e.target.value)} />
                </div>
              </div>
            )}
          </div>
          <div style={S.field}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ ...S.label, flex: '0 0 220px' }}>Screen Time — Other{(dd.screenOtherNone || dd.screenOtherHrs || dd.screenOtherMins) && <span style={{ color: STEEL, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  id="screenOtherNone"
                  style={{ accentColor: STEEL }}
                  checked={dd.screenOtherNone || false}
                  disabled={dayComplete}
                  onChange={e => upd('screenOtherNone', e.target.checked)}
                />
                <label htmlFor="screenOtherNone" style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>None</label>
              </div>
            </div>
            <label style={S.labelSm}>TV, computer, or phone not related to social media</label>
            {!dd.screenOtherNone && (
              <>
                <div style={{ display: 'flex', gap: '8px', border: screenOtherMissing ? '2px solid #cc0000' : undefined }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Hours</div>
                    <input type="number" min="0" max="24" style={S.input} placeholder="0"
                      readOnly={dayComplete} value={dd.screenOtherHrs || ''}
                      onChange={e => upd('screenOtherHrs', e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>Minutes</div>
                    <input type="number" min="0" max="59" style={S.input} placeholder="0"
                      readOnly={dayComplete} value={dd.screenOtherMins || ''}
                      onChange={e => upd('screenOtherMins', e.target.value)} />
                  </div>
                </div>
                {screenOtherMissing && (
                  <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>Required</div>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ ...S.grid2, alignItems: 'start' }}>
          <div style={S.field}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ ...S.label, flex: '0 0 220px' }}>Relationship Time</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  id="familyTimeNone"
                  style={{ accentColor: STEEL }}
                  checked={dd.familyTimeNone || false}
                  onChange={e => upd('familyTimeNone', e.target.checked)}
                />
                <label htmlFor="familyTimeNone" style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>None</label>
              </div>
            </div>
            <label style={{ ...S.labelSm, minHeight: '30px', display: 'block' }}>Total time with others throughout the day — enter in hours and minutes</label>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ ...S.label, flex: '0 0 220px' }}>PIT (Personal Investment Time)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  id="pitNone"
                  style={{ accentColor: STEEL }}
                  checked={dd.pitNone || false}
                  onChange={e => upd('pitNone', e.target.checked)}
                />
                <label htmlFor="pitNone" style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>None</label>
              </div>
            </div>
            <label style={{ ...S.labelSm, minHeight: '30px', display: 'block' }}>Time spent reading, studying, journaling, meditation, or deliberate self-development — enter in hours and minutes</label>
            {!dd.pitNone && (
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
            )}
          </div>
        </div>

        <Field label="Mood / Stress / Notes">
          <textarea style={S.textarea} value={dd.mood || ''} onChange={e => upd('mood', e.target.value)} />
        </Field>

        <div style={S.pmBlock}>
          <div style={S.pmEyebrow}>PM CHECK-IN — HOW DID I DO TODAY?{dd.rating && <span style={{ color: STEEL, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}</div>
          <div style={{ fontSize: '11px', color: STEEL_LIGHT, marginBottom: '10px' }}>
            Rate your day: 1 = Poor · 10 = Outstanding
          </div>
          <div style={ratingMissing ? { border: '2px solid #cc0000', borderRadius: 4 } : undefined}>
            <RatingButtons value={dd.rating} steel onChange={v => upd('rating', v)} disabled={dayComplete} />
          </div>
          {ratingMissing && (
            <div style={{ color: '#cc0000', fontSize: 11, marginTop: 4 }}>Required</div>
          )}
          {dd.rating && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '9px', color: '#fff', letterSpacing: '1px', marginBottom: '2px' }}>TODAY</div>
                <div style={{ ...S.pmTotBox, fontSize: '20px', fontWeight: '700', color: '#fff', border: '1px solid #fff' }}>
                  {dd.rating} / 10
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ ...S.oneThingBlock, borderColor: oneThingMissing ? '#ff0000' : RED }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: RED, marginBottom: '4px', letterSpacing: '0.5px' }}>
            TOMORROW'S ONE THING * <span style={{ fontSize: '10px', fontWeight: '400' }}>(Required)</span>{dd.oneThing && dd.oneThing.trim() && <span style={{ color: STEEL, fontSize: 13, fontWeight: 700, marginLeft: 6 }}>✓</span>}
          </label>
          <label style={S.labelSm}>
            The single task that — by completing or starting it — makes everything else easier or unnecessary.
          </label>
          <textarea
            style={{ ...S.textarea, border: '1px solid ' + (oneThingMissing ? '#ff0000' : RED), background: dayComplete ? '#f5f5f3' : '#fff9f9', minHeight: '66px' }}
            readOnly={dayComplete}
            placeholder="My one task for tomorrow..."
            value={dd.oneThing || ''}
            onChange={e => upd('oneThing', e.target.value)}
          />
          {oneThingMissing && (
            <div style={{ color: RED, fontSize: '11px', marginTop: '4px' }}>
              ⚠ Tomorrow's One Thing is required to complete this day's entry.
            </div>
          )}
        </div>

        <div style={S.addlWrap}>
          <div style={S.addlLabel}>Additional Information — Day {selectedDay}</div>
          <textarea style={S.textarea} value={dd.addl || ''} onChange={e => upd('addl', e.target.value)} />
        </div>

        <SaveNote show={saved} />

        {attempted && errorLines.length > 0 && (
          <div style={{ background: '#fff3f3', border: '2px solid #cc0000', borderRadius: 6, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#cc0000', marginBottom: 8 }}>
              ⚠ Complete the following before marking day complete
            </div>
            {errorLines.map((line, i) => (
              <div key={i} style={{ fontSize: 11, color: '#cc0000', marginBottom: 4 }}>
                • {line}
              </div>
            ))}
          </div>
        )}

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
                  style={{
                    background: GOLD,
                    color: '#000',
                    border: '3px solid #000',
                    borderRadius: 6,
                    padding: '10px 28px',
                    fontSize: 13,
                    fontWeight: 700,
                    opacity: 1,
                    cursor: 'pointer',
                  }}
                >Mark Day Complete</button>
              )}
            </div>
          );
        })()}

        {(() => {
          const daysUntilW1 = Math.max(0, 7 - selectedDay);
          const daysUntilW2 = Math.max(0, 14 - selectedDay);
          const greyStrip = {
            background: '#f0f0f0', border: '1px solid #ccc', borderRadius: 6,
            padding: '12px 16px', marginTop: 20, textAlign: 'center',
          };
          const goldStrip = {
            background: GOLD, border: '2px solid #000', borderRadius: 6,
            padding: '12px 16px', marginTop: 20,
          };
          const goldLabel = { fontSize: 12, fontWeight: 700, color: '#000', marginBottom: 8 };
          const goldBtn = {
            background: '#000', color: GOLD, border: 'none', borderRadius: 4,
            padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          };

          // STATE 1 — both weeks sent
          if (w2Sent) {
            return (
              <div style={{ ...greyStrip, fontSize: 13, color: '#666', fontWeight: 600 }}>
                ✓ Week 1 and Week 2 submitted to coach
              </div>
            );
          }
          // STATE 2 — Week 2 reflection submitted, not yet sent
          if (w2Submitted && !w2Sent) {
            return (
              <div style={goldStrip}>
                <div style={goldLabel}>WEEK 2 REFLECTION SUBMITTED</div>
                <button style={goldBtn} onClick={() => onSubmitToCoach(2)}>
                  Submit Week 2 to Coach
                </button>
              </div>
            );
          }
          // STATE 3 — Week 1 sent, Week 2 reflection not yet submitted
          if (w1Sent && !w2Submitted) {
            return (
              <div style={{ ...greyStrip, fontSize: 12, color: '#888' }}>
                <div style={{ fontWeight: 700 }}>✓ Week 1 submitted to coach</div>
                <div>
                  {daysUntilW2 > 0
                    ? `${daysUntilW2} days until final submission — complete days 8–14 and Week 2 reflection to submit`
                    : 'Complete days 8–14 and Week 2 reflection to submit'}
                </div>
              </div>
            );
          }
          // STATE 4 — Week 1 reflection submitted, not yet sent
          if (w1Submitted && !w1Sent) {
            return (
              <div style={goldStrip}>
                <div style={goldLabel}>WEEK 1 REFLECTION SUBMITTED</div>
                <button style={goldBtn} onClick={() => onSubmitToCoach(1)}>
                  Submit Week 1 to Coach
                </button>
              </div>
            );
          }
          // STATE 5 — default, neither week submitted yet
          return (
            <div style={{ ...greyStrip, fontSize: 12, color: '#888' }}>
              {daysUntilW1 > 0
                ? `${daysUntilW1} days until first submission — complete days 1–7 and Week 1 reflection to submit`
                : 'Complete days 1–7 and Week 1 reflection to submit'}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
