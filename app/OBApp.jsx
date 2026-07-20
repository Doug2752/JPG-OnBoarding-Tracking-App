import React, { useState, useEffect } from 'react';
import { makeStorage } from '../services/storage';
import { S } from '../utils/styles';
import { GOLD, MONTHS } from '../utils/constants';
import { parseDateStr, startPlusDay } from '../utils/date';
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
import ArchiveView from '../components/ArchiveView';

function isDayComplete(dd) {
  // dd is the dayData object for the selected day
  // Returns true only when ALL sections pass

  // NUTRITION — AM, Midday, PM must be filled
  const n = dd.nutrition || {};
  if (!n.am || !n.midday || !n.pm) return false;

  // ALCOHOL — at least one of beer, mixed,
  // otherNone must be filled
  const a = dd.alcohol || {};
  const alcoholFilled =
    (a.beer && String(a.beer).trim()) ||
    (a.mixed && String(a.mixed).trim()) ||
    (a.otherNone && String(a.otherNone).trim());
  if (!alcoholFilled) return false;

  // FITNESS — if activity selected, duration
  // and intensity are required; notes optional
  const f = dd.fitness || {};
  if (f.activity && f.activity !== '') {
    if (!f.duration || !f.intensity) return false;
  }

  // SLEEP — bedtime, fallAsleep, wakeTime,
  // timesUp, durationAwake, quality required
  const sl = dd.sleep || {};
  if (!sl.bedtime || !sl.fallAsleep ||
      !sl.wakeTime || !sl.timesUp ||
      !sl.durationAwake || !sl.quality) {
    return false;
  }

  // TIME & LIFE — nonNegList must have at least
  // one entry; screenOther, rating, oneThing
  // must be filled
  const t = dd.timelife || {};
  if (!t.nonNegList || t.nonNegList.length === 0)
    return false;
  if (!t.screenOther || !t.screenOther.trim())
    return false;
  if (!t.rating) return false;
  if (!t.oneThing || !t.oneThing.trim())
    return false;

  return true;
}

export default function OBApp() {
  const [user, setUser] = useState(
    () => new URLSearchParams(window.location.search).get('hub_user') ?? null
  );
  const [section, setSection] = useState('info');
  const [view, setView] = useState('today');
  const [showInstr, setShowInstr] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [neverTwiceRead, setNeverTwiceRead] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [dayData, setDayData] = useState({});
  const [dayCompleteDates, setDayCompleteDates] = useState([]);
  const [attempted, setAttempted] = useState(false);

  const storage = user ? makeStorage(user) : null;

  useEffect(() => {
    if (!storage) return;
    storage.load('clientInfo', {}).then(d => {
      if (d && d.dateStarted) setStartDate(d.dateStarted);
    });
    storage.load('neverTwiceRead', false).then(v => setNeverTwiceRead(v));
    storage.loadList('obt_day_complete').then(
      arr => setDayCompleteDates(arr || [])
    );
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

  // Convert a 1-based day number to its YYYY-MM-DD key.
  // Returns null when no start date is set.
  function isoForDay(dayNum) {
    if (!startDate) return null;
    return startPlusDay(startDate, dayNum);
  }

  function loadDayData(dayNum) {
    const iso = isoForDay(dayNum);
    if (!iso || !storage) {
      setDayData({});
      return;
    }
    storage.loadDay(iso, {}).then(d => setDayData(d || {}));
  }

  function saveDayData(section, sectionData) {
    const iso = isoForDay(selectedDay);
    if (!iso || !storage) return;
    const next = { ...dayData, [section]: sectionData };
    setDayData(next);
    storage.saveDay(iso, next);
    storage.addToList('obt_arch', iso);
  }

  function onMarkDayComplete() {
    if (!isDayComplete(dayData)) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    const iso = isoForDay(selectedDay);
    if (!iso) return;
    if (!dayCompleteDates.includes(iso)) {
      setDayCompleteDates([...dayCompleteDates, iso]);
    }
    if (storage) storage.addToList('obt_day_complete', iso);
  }

  function onUnlockDay() {
    const iso = isoForDay(selectedDay);
    if (!iso) return;
    const filtered = dayCompleteDates.filter(d => d !== iso);
    setDayCompleteDates(filtered);
    setAttempted(false);
    if (storage) storage.save('obt_day_complete', filtered);
  }

  useEffect(() => {
    loadDayData(selectedDay);
  }, [selectedDay, startDate]);

  const dateInputVal = (() => {
    if (!startDate) return '';
    const [m, d, y] = startDate.split('/');
    return (m && d && y) ? `${y}-${m}-${d}` : '';
  })();

  if (!user) return <Login onLogin={setUser} />;

  if (view === 'archive') {
    return (
      <ArchiveView
        view={view}
        setView={setView}
        onLogout={() => setUser(null)}
        firstName={user}
        dayCompleteDates={dayCompleteDates}
      />
    );
  }

  const dayProps = {
    storage,
    startDate,
    dayData,
    selectedDay,
    onSave: saveDayData,
    onDaySelect: setSelectedDay,
    isDayComplete,
    dayComplete: isDayComplete(dayData),
    dayCompleteDates,
    onMarkDayComplete,
    onUnlockDay,
    isoForDay,
    attempted,
  };

  function renderSection() {
    if (section === 'info') return <ClientInfo storage={storage} />;
    if (section === 'nutrition') return <NutritionSection {...dayProps} />;
    if (section === 'alcohol') return <AlcoholSection {...dayProps} />;
    if (section === 'fitness') return <FitnessSection {...dayProps} />;
    if (section === 'sleep') return <SleepSection {...dayProps} />;
    if (section === 'timelife') return <TimeLifeSection {...dayProps} />;
    if (section === 'reflect') return <ReflectSection storage={storage} />;
    if (section === 'results') return <SummaryResults storage={storage} />;
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
        view={view}
        setView={setView}
        daysComplete={dayCompleteDates.length}
        dayComplete={isDayComplete(dayData)}
        isDayMarked={dayCompleteDates.includes(isoForDay(selectedDay) || '')}
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
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
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
