import React, { useState, useEffect } from 'react';
import { makeStorage } from '../services/storage';
import { S } from '../utils/styles';
import { MONTHS } from '../utils/constants';
import { parseDateStr } from '../utils/date';
import Login from '../components/Login.jsx';
import InstructionsPanel from '../components/InstructionsPanel.jsx';
import ClientInfo from '../components/ClientInfo.jsx';
import NutritionSection from '../components/NutritionSection.jsx';
import AlcoholSection from '../components/AlcoholSection.jsx';
import FitnessSection from '../components/FitnessSection.jsx';
import SleepSection from '../components/SleepSection.jsx';
import TimeLifeSection from '../components/TimeLifeSection.jsx';
import ReflectSection from '../components/ReflectSection.jsx';
import SummaryResults from '../components/SummaryResults.jsx';

const TABS = [
  { id: 'info',      label: 'Client Info' },
  { id: 'nutrition', label: '01 — Nutrition' },
  { id: 'alcohol',   label: '02 — Alcohol' },
  { id: 'fitness',   label: '03 — Fitness' },
  { id: 'sleep',     label: '04 — Sleep' },
  { id: 'timelife',  label: '05 — Time & Life' },
  { id: 'reflect',   label: 'Reflect' },
  { id: 'results',   label: 'Summary Results' }
];

export default function OBApp() {
  const [user, setUser] = useState(
    () => new URLSearchParams(window.location.search).get('hub_user') ?? null
  );
  const [section, setSection] = useState('info');
  const [showInstr, setShowInstr] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [neverTwiceRead, setNeverTwiceRead] = useState(false);

  const storage = user ? makeStorage(user) : null;

  useEffect(() => {
    if (!storage) return;
    storage.load('clientInfo', {}).then(d => {
      if (d && d.dateStarted) setStartDate(d.dateStarted);
    });
    storage.load('neverTwiceRead', false).then(v => setNeverTwiceRead(v));
    storage.load('instrSeen6', false).then(seen => {
      if (!seen) {
        setShowInstr(true);
        storage.save('instrSeen6', true);
      }
    });
  }, [user]);

  // Format a stored start date as "Month D, YYYY" for the picker button
  function fmtStart(s) {
    const d = parseDateStr(s);
    if (!d) return 'Set Start Date';
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function setNeverTwice(v) {
    setNeverTwiceRead(v);
    if (storage) storage.save('neverTwiceRead', v);
  }

  const dateInputVal = (() => {
    if (!startDate) return '';
    const [m, d, y] = startDate.split('/');
    return (m && d && y) ? `${y}-${m}-${d}` : '';
  })();

  if (!user) return <Login onLogin={setUser} />;

  function renderSection() {
    if (section === 'info')      return <ClientInfo storage={storage} />;
    if (section === 'nutrition') return <NutritionSection storage={storage} startDate={startDate} />;
    if (section === 'alcohol')   return <AlcoholSection storage={storage} startDate={startDate} />;
    if (section === 'fitness')   return <FitnessSection storage={storage} startDate={startDate} />;
    if (section === 'sleep')     return <SleepSection storage={storage} startDate={startDate} />;
    if (section === 'timelife')  return <TimeLifeSection storage={storage} startDate={startDate} />;
    if (section === 'reflect')   return <ReflectSection storage={storage} />;
    if (section === 'results')   return <SummaryResults storage={storage} />;
    return null;
  }

  return (
    <div style={S.app}>
      {showInstr && <InstructionsPanel onClose={() => setShowInstr(false)} />}

      {/* Top nav */}
      <div style={{
        background: '#111', height: 52,
        borderBottom: '2px solid #B8860B',
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
        padding: '0 20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setShowInstr(true)}
            style={{
              padding: '6px 14px', borderRadius: 5,
              border: '1.5px solid #B8860B', background: 'transparent',
              color: '#B8860B', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.5, whiteSpace: 'nowrap'
            }}
          >
            Set-Up and Instructions
          </button>
          <span style={{ color: '#aaa', fontSize: 12 }}>{user}</span>
          <button
            onClick={() => setUser(null)}
            style={{
              background: 'transparent', border: 'none',
              color: '#666', cursor: 'pointer', fontSize: 12
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Brand bar */}
      <div
        style={{
          background: '#fff', borderBottom: '4px solid #B8860B',
          padding: '10px 20px'
        }}
        onClick={() => setDateOpen(false)}
      >
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', maxWidth: 900, margin: '0 auto',
          width: '100%', boxSizing: 'border-box'
        }}>
          {/* LEFT — logo */}
          <img
            src="/jpglogo.png" alt="Jones Performance Group"
            style={{ width: 260, height: 'auto', display: 'block' }}
          />

          {/* CENTER — title + date picker + Never Twice */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8, textAlign: 'center' }}>
              <div style={{
                fontSize: 38, fontWeight: 900, color: '#000',
                lineHeight: 1
              }}>
                OBT
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#000',
                letterSpacing: 0.5, marginTop: 3
              }}>
                OnBoarding & Tracking
              </div>
            </div>

            {/* Date picker */}
            <div
              style={{
                position: 'relative', marginBottom: 10,
                display: 'inline-block'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setDateOpen(o => !o)}
                style={{
                  background: '#fff', border: '1px solid #B8860B',
                  borderRadius: 5, padding: '4px 14px', fontSize: 12,
                  fontWeight: 600, color: '#1a1a1a', cursor: 'pointer',
                  letterSpacing: 0.3
                }}
              >
                {startDate ? fmtStart(startDate) : 'Set Start Date'}
                <span style={{
                  marginLeft: 8, fontSize: 16,
                  color: '#B8860B', lineHeight: 1,
                }}>▾</span>
              </button>
              {dateOpen && (
                <div style={{
                  position: 'absolute', top: '110%', left: '50%',
                  transform: 'translateX(-50%)', background: '#fff',
                  border: '1px solid #D8D5CF', borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  padding: 12, minWidth: 260, zIndex: 200,
                }}>
                  <input
                    type="date"
                    value={dateInputVal}
                    onChange={e => {
                      const raw = e.target.value;
                      if (!raw) return;
                      const [y, m, d] = raw.split('-');
                      const fmt = `${m}/${d}/${y}`;
                      setStartDate(fmt);
                      setDateOpen(false);
                      storage.load('clientInfo', {}).then(ci =>
                        storage.save('clientInfo',
                          { ...ci, dateStarted: fmt })
                      );
                    }}
                    style={{
                      display: 'block', width: '100%',
                      marginBottom: 8
                    }}
                  />
                  <button
                    onClick={() => {
                      const now = new Date();
                      const m = String(now.getMonth() + 1)
                        .padStart(2, '0');
                      const d = String(now.getDate())
                        .padStart(2, '0');
                      const y = now.getFullYear();
                      const fmt = `${m}/${d}/${y}`;
                      setStartDate(fmt);
                      setDateOpen(false);
                      storage.load('clientInfo', {}).then(ci =>
                        storage.save('clientInfo',
                          { ...ci, dateStarted: fmt })
                      );
                    }}
                    style={{
                      width: '100%', padding: '6px 0',
                      background: '#B8860B', color: '#000',
                      border: 'none', borderRadius: 5,
                      fontSize: 12, fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >Today</button>
                </div>
              )}
            </div>

            {/* Never Twice */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                border: '1.5px solid #000', borderRadius: 5,
                padding: '5px 14px', background: '#B8860B'
              }}>
                <span style={{
                  fontSize: 15, fontWeight: 900, color: '#000',
                  letterSpacing: 1, textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  Never Twice
                </span>
                <span style={{
                  fontSize: 8, fontWeight: 600, color: '#000',
                  letterSpacing: 0.3, whiteSpace: 'nowrap'
                }}>
                  Miss one — never miss the second.
                </span>
              </div>
              <label style={{
                marginTop: 6, fontSize: 10, fontWeight: 700,
                color: '#1a1a1a', letterSpacing: 0.3,
                userSelect: 'none', display: 'flex',
                alignItems: 'center', gap: 5, justifyContent: 'center'
              }}>
                <input
                  type="checkbox"
                  checked={neverTwiceRead}
                  onChange={e => setNeverTwice(e.target.checked)}
                  style={{
                    width: 13, height: 13, accentColor: '#B8860B'
                  }}
                />
                I've read this. Never twice.
              </label>
            </div>
          </div>

          {/* RIGHT — spacer */}
          <div style={{ width: 76 }} />
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        background: '#111', borderBottom: '2px solid #B8860B',
        padding: '0 20px', display: 'flex', gap: 8,
        alignItems: 'center', height: 44
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSection(t.id)}
            style={{
              padding: '8px 18px', borderRadius: 5, border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: section === t.id ? '#B8860B' : '#333',
              color: '#fff', letterSpacing: 0.5, whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={S.content}>
        {renderSection()}
      </div>

      {/* Footer */}
      <div style={S.footer}>
        JPG-TK-001 · Jones Performance Group LLC · 14-Day Initial Onboarding Tracking Log · CONFIDENTIAL
      </div>
    </div>
  );
}
