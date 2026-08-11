import React from 'react';
import { GOLD } from '../utils/constants';

export default function Header({
  onInstructions, showInstr, onLogout, firstName, daysComplete = 0,
}) {
  return (
    <div style={{
      background: '#111',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 52,
    }}>
      <div style={{
        color: GOLD,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}>
        Day {Math.max(1, daysComplete)} of 14
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          style={{
            padding: '5px 13px',
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

        <span style={{
          color: GOLD,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {firstName}
        </span>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: GOLD,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            padding: 0,
          }}
          onClick={onLogout}
        >logout</button>
      </div>
    </div>
  );
}
