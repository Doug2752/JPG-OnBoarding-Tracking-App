import React, { useState, useEffect } from 'react';
import { makeStorage } from '../services/storage';
import { S } from '../utils/styles';
import { GOLD, MONTHS } from '../utils/constants';
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
import Header from '../components/Header.jsx';
import BrandBar from '../components/BrandBar.jsx';

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
      <Header
        section={section}
        setSection={setSection}
        onInstructions={() => setShowInstr(i => !i)}
        showInstr={showInstr}
        onLogout={() => setUser(null)}
        firstName={user}
        streak={0}
      />

      <BrandBar
        startDate={startDate}
        fmtStart={fmtStart}
        dateOpen={dateOpen}
        setDateOpen={setDateOpen}
        dateInputVal={dateInputVal}
        onDateChange={e => {
          const raw = e.target.value;
          if (!raw) return;
          const [y, m, d] = raw.split('-');
          const fmt = `${m}/${d}/${y}`;
          setStartDate(fmt);
          setDateOpen(false);
          storage.load('clientInfo', {}).then(
            ci => storage.save('clientInfo',
              { ...ci, dateStarted: fmt })
          );
        }}
        neverTwiceRead={neverTwiceRead}
        setNeverTwice={setNeverTwice}
      />

      <div style={{
        background: '#111',
        borderBottom: `2px solid ${GOLD}`,
        padding: '0 20px',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        height: 40,
      }}>
        {[
          { id: 'info',      label: 'Client Info' },
          { id: 'nutrition', label: 'Nutrition' },
          { id: 'alcohol',   label: 'Alcohol' },
          { id: 'fitness',   label: 'Fitness' },
          { id: 'sleep',     label: 'Sleep' },
          { id: 'timelife',  label: 'Time & Life' },
          { id: 'reflect',   label: 'Reflect' },
          { id: 'results',   label: 'Summary Results' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSection(t.id)}
            style={{
              padding: '4px 12px',
              borderRadius: 5,
              border: 'none',
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
              color: '#fff',
              background: section === t.id
                ? GOLD : '#333',
            }}
          >{t.label}</button>
        ))}
      </div>

      {showInstr && (
        <InstructionsPanel onClose={() => setShowInstr(false)} />
      )}

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
