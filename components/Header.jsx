import React from 'react';
import { GOLD } from '../utils/constants';

export default function Header({
  onInstructions, showInstr,
  onLogout, firstName,
}) {
  return (
    <div style={{
      background: '#111',
      borderBottom: `2px solid ${GOLD}`,
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
      height: 52,
    }}>
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
