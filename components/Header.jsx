import React from 'react';
import { GOLD, GOLD_LIGHT } from '../utils/constants';

const gbtn = (extra = {}) => ({
  padding: '8px 18px',
  borderRadius: 5,
  border: '1.5px solid #000',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  background: GOLD_LIGHT,
  color: '#000',
  letterSpacing: 0.5,
  whiteSpace: 'nowrap',
  ...extra,
});

export default function Header({
  onInstructions, showInstr, onLogout, firstName,
  view, setView, daysComplete = 0,
  dayComplete = false, isDayMarked = false,
}) {
  let pillBg = '#333';
  let pillText = daysComplete + ' of 14 Days Complete';
  if (isDayMarked) {
    pillBg = '#333';
    pillText = 'Day Complete';
  } else if (dayComplete) {
    pillBg = GOLD;
    pillText = 'Required Fields Done';
  }
  return (
    <div style={{
      background: '#111',
      borderBottom: `2px solid ${GOLD}`,
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
      height: 52,
    }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setView('today')}
          style={gbtn({
            background: view === 'today' ? GOLD : '#333',
            color: '#fff',
            border: 'none',
            fontSize: 12,
          })}
        >Today</button>
        <button
          onClick={() => setView('archive')}
          style={gbtn({
            background: view === 'archive' ? GOLD : '#333',
            color: '#fff',
            border: 'none',
            fontSize: 12,
          })}
        >Archive</button>
      </div>

      <div style={{
        background: pillBg,
        color: '#fff',
        borderRadius: 6,
        padding: '5px 14px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
        marginLeft: 120,
        marginRight: 16,
      }}>
        {pillText}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <button
          style={{
            padding: '6px 14px',
            borderRadius: 5,
            border: `1.5px solid ${GOLD}`,
            background: 'transparent',
            color: GOLD,
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}
          onClick={onInstructions}
        >{showInstr
          ? 'Close Set-Up and Instructions'
          : 'Set-Up and Instructions'}
        </button>
        <span style={{ color: '#aaa', fontSize: 12 }}>
          {firstName}
        </span>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: 12,
          }}
          onClick={onLogout}
        >Logout</button>
      </div>
    </div>
  );
}
