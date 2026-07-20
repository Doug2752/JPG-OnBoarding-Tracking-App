import React, { useState, useEffect } from 'react';
import { GOLD, DARK } from '../utils/constants.js';
import { startPlusDay, todayISO } from '../utils/date.js';

const PATCH_SRC = '/LIMITLESS_Tier_4_Patch.png';

const QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { text: "Champions are made from something they have deep inside them — a desire, a dream, a vision.", author: "Muhammad Ali" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Your limitation — it's only your imagination.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" }
];

// Which of the 14 program days today falls on.
// Clamps to Day 1 before the window and Day 14 after it.
// Returns null when no start date is set.
function currentDayNum(startDate) {
  if (!startDate) return null;
  const today = todayISO();
  for (let n = 1; n <= 14; n++) {
    if (startPlusDay(startDate, n) === today) return n;
  }
  const first = startPlusDay(startDate, 1);
  const last = startPlusDay(startDate, 14);
  if (last && today > last) return 14;
  if (first && today < first) return 1;
  return null;
}

function pickQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return QUOTES[dayOfYear % QUOTES.length];
}

export default function CoverPage({
  user, startDate, dayCompleteDates = [], onEnter,
  clientInfoFilled, onClientInfo,
}) {
  // Falls back to a styled placeholder until the patch art is added to /public.
  const [patchOk, setPatchOk] = useState(true);

  // Pull in Rajdhani for the cover typography.
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  const firstName = user
    ? String(user).charAt(0).toUpperCase() + String(user).slice(1)
    : '';

  const dayNum = currentDayNum(startDate);
  const statusLine = 'Day ' + (dayNum === null ? '—' : dayNum) +
    ' of 14 — ' + dayCompleteDates.length + ' ' +
    (dayCompleteDates.length === 1 ? 'Day' : 'Days') + ' Complete';

  const quote = pickQuote();

  const limitWord = {
    color: DARK,
    fontSize: '2.8rem',
    fontWeight: 900,
    letterSpacing: '0.06em',
    lineHeight: 1,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: GOLD,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      boxSizing: 'border-box',
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 580,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>

        {/* 1 — Logo. multiply blend drops the file's white background
            against the gold page without editing the asset. */}
        <img
          src="/jpglogo.png"
          alt="Jones Performance Group"
          style={{
            width: 480,
            height: 'auto',
            display: 'block',
            mixBlendMode: 'multiply',
            marginBottom: 24,
          }}
        />

        {/* 2 — Welcome */}
        <div style={{
          color: DARK,
          fontSize: '2.05rem',
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '0.04em',
          marginBottom: 4,
        }}>
          Welcome, {firstName}
        </div>

        {/* 3 — Program status */}
        <div style={{
          color: DARK,
          fontSize: '1.4rem',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 28,
        }}>
          {statusLine}
        </div>

        {/* 4 — LIMIT|LESS block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 28,
        }}>
          {/* Mark + tagline */}
          <div style={{
            flex: '0 1 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <span style={limitWord}>LIMIT</span>
              <div style={{
                width: 4,
                height: '3.2rem',
                background: DARK,
                margin: '0 8px',
                flexShrink: 0,
              }} />
              <span style={limitWord}>LESS</span>
            </div>
            <div style={{
              color: DARK,
              fontSize: '1rem',
              fontWeight: 500,
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: 200,
              lineHeight: 1.5,
              marginTop: 8,
            }}>
              Every day is a chance to exist outside of boundaries.
            </div>
          </div>
        </div>

        {/* 5 — Daily quote */}
        <div style={{
          background: '#8B6508',
          border: 'none',
          borderRadius: 10,
          padding: '16px 20px',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
          marginBottom: 28,
        }}>
          <div style={{
            color: '#FFFFFF',
            fontSize: '1.05rem',
            fontStyle: 'italic',
            lineHeight: 1.6,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {quote.text}
          </div>
          <div style={{
            color: '#FFFFFF',
            fontSize: '0.95rem',
            textAlign: 'center',
          }}>
            — {quote.author}
          </div>
        </div>

        {/* 6 — Client Info */}
        <button
          onClick={onClientInfo}
          style={{
            background: 'transparent',
            color: '#1A1A1A',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            border: '2px solid #1A1A1A',
            borderRadius: 6,
            padding: '10px 36px',
            width: '100%',
            maxWidth: 320,
            display: 'block',
            margin: '0 auto',
            marginBottom: 10,
            cursor: 'pointer',
          }}
        >
          {clientInfoFilled ? 'EDIT CLIENT INFO' : 'COMPLETE CLIENT INFO'}
        </button>

        {/* 7 — Enter */}
        <button
          onClick={onEnter}
          style={{
            background: DARK,
            color: GOLD,
            fontSize: '1.1rem',
            fontWeight: 900,
            letterSpacing: '0.1em',
            border: '2px solid ' + DARK,
            borderRadius: 6,
            padding: '14px 36px',
            width: '100%',
            maxWidth: 320,
            display: 'block',
            margin: '0 auto',
            marginTop: 24,
            cursor: 'pointer',
          }}
        >
          START TODAY'S ENTRY
        </button>

      </div>
    </div>
  );
}
