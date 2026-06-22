import React, { useState, useEffect } from 'react';
import { makeStorage } from '../services/storage';
import { S } from '../utils/styles';
import { LOGO_DARK, LOGO_LIGHT, GOLD, DARK } from '../utils/constants';
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

  const storage = user ? makeStorage(user) : null;

  useEffect(() => {
    if (!storage) return;
    storage.load('clientInfo', {}).then(d => {
      if (d && d.dateStarted) setStartDate(d.dateStarted);
    });
    storage.load('instrSeen6', false).then(seen => {
      if (!seen) {
        setShowInstr(true);
        storage.save('instrSeen6', true);
      }
    });
  }, [user]);

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
      <div style={S.topNav}>
        <div style={S.navLogoWrap}>
          <img src={LOGO_DARK} alt="JPG" style={S.navLogo} />
        </div>
        <div style={S.navCenter}>Jones Performance Group</div>
        <div style={S.navRight}>
          <span style={S.navUser}>{user}</span>
          <button style={S.navLogout} onClick={() => setUser(null)}>Logout</button>
        </div>
      </div>

      {/* Page header */}
      <div style={S.pageHeader}>
        <div>
          <div style={S.pageTitle}>14-DAY TRACKING</div>
          <div style={S.pageSub}>Initial Onboarding Log · Baseline Assessment · JPG-TK-001</div>
        </div>
        <button style={S.instrBtn} onClick={() => setShowInstr(true)}>? Instructions</button>
      </div>

      {/* Tab bar */}
      <div style={S.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            style={{ ...S.tab, ...(section === t.id ? S.tabActive : {}) }}
            onClick={() => setSection(t.id)}
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
