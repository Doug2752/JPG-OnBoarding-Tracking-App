import React, { useState, useEffect } from 'react';
import { makeStorage } from '../services/storage';
import { S } from '../utils/styles';
import { GOLD, GOLD_LIGHT, DARK, BG } from '../utils/constants';
import { startPlusDay, todayISO } from '../utils/date';
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
import CoverPage from '../components/CoverPage.jsx';

// Client Info counts as filled only when all eleven required fields
// carry a non-empty value. goal2, goal3 and additional are optional.
const CI_REQUIRED = [
  'fullName','dateStarted','trackingStartDate','phone','email','occupation','primaryGoal',
  'nonNeg','hobbies','fitnessActivity','eatingHabits','sleepPatterns',
  'injuries'
];

function isClientInfoFilled(ci) {
  return CI_REQUIRED.every(k => ci && typeof ci[k] === 'string'
    && ci[k].trim().length > 0);
}

function isDayComplete(dd) {
  // dd is the dayData object for the selected day
  // Returns true only when ALL sections pass

  // NUTRITION — AM, Midday, PM must be filled
  const n = dd.nutrition || {};
  if (!n.am || !n.midday || !n.pm) return false;

  // ALCOHOL — alcoholNone checked OR beer, mixed, or otherAlc filled
  const a = dd.alcohol || {};
  const alcoholFilled =
    a.alcoholNone === true ||
    (a.beer && String(a.beer).trim()) ||
    (a.mixed && String(a.mixed).trim()) ||
    (a.otherAlc && String(a.otherAlc).trim());
  if (!alcoholFilled) return false;

  // FITNESS — if activity selected, duration
  // and intensity are required; notes optional
  const f = dd.fitness || {};
  if (f.activity && f.activity !== '' && f.activity !== 'None' && f.activity !== 'Rest') {
    if (!(f.durationHrs || f.durationMins) || !f.intensity) return false;
  }

  // SLEEP — bedtime, fallAsleep, wakeTime,
  // timesUp, durationAwake, quality required
  const sl = dd.sleep || {};
  const timesUpIsZero = sl.timesUp === '0' || sl.timesUp === 0;
  if (!sl.bedtime || !sl.fallAsleep ||
      !sl.wakeTime || !sl.timesUp ||
      (!timesUpIsZero && !sl.durationAwake) || !sl.quality) {
    return false;
  }

  // TIME & LIFE — nonNegList must have at least
  // one entry; screenSocial, screenOther, rating,
  // oneThing must be filled
  const t = dd.timelife || {};
  if (!t.nonNegList || t.nonNegList.length === 0)
    return false;
  if (!t.screenSocialNone && !t.screenSocialHrs && !t.screenSocialMins)
    return false;
  if (!t.screenOtherNone && !t.screenOtherHrs && !t.screenOtherMins)
    return false;
  if (!t.rating) return false;
  if (!t.oneThing || !t.oneThing.trim())
    return false;

  // WORK HOURS — required unless schedule is Retired
  const workSchedule = t.workSchedule || '';
  if (workSchedule !== 'Retired') {
    if (!t.workHoursNum && t.workHoursNum !== 0) return false;
  }

  return true;
}

export default function OBApp() {
  const [user, setUser] = useState(
    () => new URLSearchParams(window.location.search).get('hub_user') ?? null
  );
  const [section, setSection] = useState('nutrition');
  const [view, setView] = useState('today');
  const [showInstr, setShowInstr] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [trackingStartDate, setTrackingStartDate] = useState('');
  const [clientInfoFilled, setClientInfoFilled] = useState(false);
  const [neverTwiceRead, setNeverTwiceRead] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [dayData, setDayData] = useState({});
  const [dayCompleteDates, setDayCompleteDates] = useState([]);
  const [attempted, setAttempted] = useState(false);
  const [reflectSubmissions, setReflectSubmissions] = useState([]);
  const [coachSubmissions, setCoachSubmissions] = useState({ w1Sent: false, w2Sent: false });
  const [reflectPopup, setReflectPopup] = useState(null);
  const [popupSeen, setPopupSeen] = useState({ w1: false, w2: false });
  const [showCover, setShowCover] = useState(false);

  const storage = user ? makeStorage(user) : null;

  useEffect(() => {
    if (!storage) return;
    const pClient = storage.load('clientInfo', {}).then(d => {
      if (d && d.dateStarted) setStartDate(d.dateStarted);
      if (d && d.trackingStartDate) setTrackingStartDate(d.trackingStartDate);
      setClientInfoFilled(isClientInfoFilled(d));
    });
    const pNever = storage.load('neverTwiceRead', false).then(
      v => setNeverTwiceRead(v)
    );
    const pDays = storage.loadList('obt_day_complete').then(
      arr => setDayCompleteDates(arr || [])
    );
    const pSubs = storage.load('reflect_submissions', []).then(
      arr => setReflectSubmissions(arr || [])
    );
    const pSeen = storage.load('reflect_popup_seen', { w1: false, w2: false }).then(
      v => setPopupSeen(v || { w1: false, w2: false })
    );
    const pCoach = storage.load('coach_submissions', { w1Sent: false, w2Sent: false }).then(
      v => setCoachSubmissions(v || { w1Sent: false, w2Sent: false })
    );
    const pInstr = storage.load('instrSeen6', false).then(seen => {
      if (!seen) {
        setShowInstr(true);
        storage.save('instrSeen6', true);
      }
    });
    // Cover shows once per session, only after the loads above have landed
    // so the day count and status line render with real values.
    Promise.all([pClient, pNever, pDays, pSubs, pSeen, pCoach, pInstr])
      .then(() => setShowCover(true));
  }, [user]);

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

  function dayForIso(iso) {
    for (let n = 1; n <= 14; n++) {
      if (isoForDay(n) === iso) return n;
    }
    return null;
  }

  function onViewDay(iso) {
    const n = dayForIso(iso);
if (n === null) return;
    setSelectedDay(n);
    setView('today');
  }

  function onViewReflect(week) {
    setSelectedDay(week === 1 ? 7 : 14);
    setSection('reflect');
    setView('today');
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

  async function onSubmitToCoach(week) {
    const ci = await storage.load('clientInfo', {});
    const reflect = await storage.load('reflect6', {});
    const startDay = week === 1 ? 1 : 8;
    const endDay = week === 1 ? 7 : 14;
    const days = [];
    for (let n = startDay; n <= endDay; n++) {
      const iso = startPlusDay(startDate, n);
      if (iso) {
        const data = await storage.loadDay(iso, {});
        days.push({ day: n, iso, data });
      }
    }
    const reflectKeys = week === 1
      ? ['w1_well', 'w1_challenge', 'w1_energy', 'w1_different']
      : ['w2_well', 'w2_challenge', 'w2_energy', 'w2_different'];
    const reflectData = {};
    reflectKeys.forEach(k => reflectData[k] = reflect[k] || '');
    // TODO: wire to Supabase — replace this block with API call when backend is ready
    const payload = {
      week,
      submittedAt: todayISO(),
      clientInfo: ci,
      days,
      reflection: reflectData,
    };
    const next = { ...coachSubmissions, [`w${week}Sent`]: true };
    setCoachSubmissions(next);
    await storage.save('coach_submissions', next);
  }

  function onReflectSubmit(week, dateISO) {
    const next = [...reflectSubmissions, { week, date: dateISO }];
    setReflectSubmissions(next);
    if (storage) storage.save('reflect_submissions', next);
  }

  // Mark a week's popup seen so it never shows again, then close it.
  function dismissReflectPopup(week, goToReflect) {
    const next = { ...popupSeen, ['w' + week]: true };
    setPopupSeen(next);
    if (storage) storage.save('reflect_popup_seen', next);
    setReflectPopup(null);
    if (goToReflect) setSection('reflect');
  }

  // Fire the reflection popup when Day 7 / Day 14 is marked complete.
  // Day 7 is startDate + 6 days; Day 14 is startDate + 13 days.
  useEffect(() => {
    if (!startDate) return;
    const w1Done = reflectSubmissions.some(r => r.week === 1);
    const w2Done = reflectSubmissions.some(r => r.week === 2);
    const day14 = startPlusDay(startDate, 14);
    if (day14 && dayCompleteDates.includes(day14) && !w2Done && !popupSeen.w2) {
      setReflectPopup(2);
      return;
    }
    const day7 = startPlusDay(startDate, 7);
    if (day7 && dayCompleteDates.includes(day7) && !w1Done && !popupSeen.w1) {
      setReflectPopup(1);
      return;
    }
    // Authoritative — clears a popup opened before popup_seen finished loading.
    setReflectPopup(null);
  }, [dayCompleteDates, startDate, reflectSubmissions, popupSeen]);

  useEffect(() => {
    loadDayData(selectedDay);
  }, [selectedDay, startDate]);

  if (!user) return <Login onLogin={setUser} />;

  if (user && showCover) {
    return (
      <CoverPage
        user={user}
        startDate={startDate}
        dayCompleteDates={dayCompleteDates}
        clientInfoFilled={clientInfoFilled}
        onClientInfo={() => { setShowCover(false); setSection('info'); }}
        onEnter={() => {
          // First entry with no start date stamps today as Day 1.
          // resolvedStart is used locally because setStartDate is async.
          let resolvedStart = startDate;
          if (!resolvedStart) {
            const today = todayISO();
            const [y, m, d] = today.split('-');
            resolvedStart = m + '/' + d + '/' + y;
            setStartDate(resolvedStart);
            storage.load('clientInfo', {}).then(ci =>
              storage.save('clientInfo', { ...ci, dateStarted: resolvedStart })
            );
          }
          let dayNum = 1;
          for (let n = 1; n <= 14; n++) {
            if (startPlusDay(resolvedStart, n) === todayISO()) { dayNum = n; break; }
            if (n === 14) dayNum = 14;
          }
          setShowCover(false);
          setSection(!clientInfoFilled && dayNum === 1 ? 'info' : 'nutrition');
        }}
      />
    );
  }

  if (view === 'archive') {
    return (
      <ArchiveView
        view={view}
        setView={setView}
        onLogout={() => setUser(null)}
        firstName={user}
        dayCompleteDates={dayCompleteDates}
        reflectSubmissions={reflectSubmissions}
        onViewDay={onViewDay}
        onViewReflect={onViewReflect}
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
    dayComplete: dayCompleteDates.includes(isoForDay(selectedDay) || ''),
    dayCompleteDates,
    onMarkDayComplete,
    onUnlockDay,
    isoForDay,
    attempted,
  };

  function renderSection() {
    if (section === 'info') return (
      <ClientInfo
        storage={storage}
        onDateStarted={v => setStartDate(v)}
        onTrackingStartDate={v => setTrackingStartDate(v)}
        onFillChange={v => setClientInfoFilled(v)}
      />
    );
    if (section === 'nutrition') return <NutritionSection {...dayProps} />;
    if (section === 'alcohol') return <AlcoholSection {...dayProps} />;
    if (section === 'fitness') return <FitnessSection {...dayProps} />;
    if (section === 'sleep') return <SleepSection {...dayProps} />;
    if (section === 'timelife') {
      const w1Submitted = reflectSubmissions.some(r => r.week === 1);
      const w2Submitted = reflectSubmissions.some(r => r.week === 2);
      return (
        <TimeLifeSection
          {...dayProps}
          w1Submitted={w1Submitted}
          w2Submitted={w2Submitted}
          w1Sent={coachSubmissions.w1Sent}
          w2Sent={coachSubmissions.w2Sent}
          onSubmitToCoach={onSubmitToCoach}
        />
      );
    }
    if (section === 'reflect') return (
      <ReflectSection
        storage={storage}
        dayCompleteDates={dayCompleteDates}
        reflectSubmissions={reflectSubmissions}
        onReflectSubmit={onReflectSubmit}
      />
    );
    if (section === 'results') return <SummaryResults storage={storage} startDate={startDate} />;
    return null;
  }

  return (
    <div style={S.app}>
      <Header
        onInstructions={() => setShowInstr(i => !i)}
        showInstr={showInstr}
        onLogout={() => setUser(null)}
        firstName={user}
        view={view}
        setView={setView}
        daysComplete={dayCompleteDates.length}
        dayComplete={isDayComplete(dayData)}
        isDayMarked={dayCompleteDates.includes(isoForDay(selectedDay) || '')}
      />

      <BrandBar
        neverTwiceRead={neverTwiceRead}
        setNeverTwice={setNeverTwice}
        user={user}
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
          { id: 'reflect',   label: 'Reflection' },
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

      {reflectPopup !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
        }}>
          <div style={{
            background: BG,
            border: `2px solid ${GOLD}`,
            borderRadius: 6,
            padding: '24px 28px',
            maxWidth: 420,
            width: '90%',
            boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: DARK,
              marginBottom: 10,
            }}>
              WEEK {reflectPopup} REFLECTION
            </div>
            <div style={{
              fontSize: 13,
              color: DARK,
              lineHeight: 1.5,
              marginBottom: 20,
            }}>
              You have completed Day {reflectPopup === 1 ? 7 : 14}. Time to
              complete your Week {reflectPopup} Reflection.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => dismissReflectPopup(reflectPopup, true)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 5,
                  border: '1.5px solid #000',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  background: GOLD_LIGHT,
                  color: '#000',
                }}
              >Go to Reflect</button>
              <button
                onClick={() => dismissReflectPopup(reflectPopup, false)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 5,
                  border: '1px solid #bbb',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  background: '#e0e0e0',
                  color: DARK,
                }}
              >Dismiss</button>
            </div>
          </div>
        </div>
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
