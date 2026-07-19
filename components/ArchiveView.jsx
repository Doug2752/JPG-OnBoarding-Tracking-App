import React from 'react';
import { S } from '../utils/styles';
import { GOLD, GOLD_LIGHT, MONTHS } from '../utils/constants';

// Format a YYYY-MM-DD ISO string as "Month D, YYYY".
// Parsed from parts to avoid timezone shifts.
function fmtIso(iso) {
  const [y, m, d] = String(iso).split('-');
  if (!y || !m || !d) return iso;
  return MONTHS[parseInt(m, 10) - 1] + ' ' + parseInt(d, 10) + ', ' + y;
}

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

export default function ArchiveView({
  view, setView, onLogout, firstName, dayCompleteDates = [],
}) {
  return (
    <div style={S.app}>
      {/* Own nav bar — matches PIT Header outer div dimensions */}
      <div style={{
        background: '#111',
        borderBottom: `2px solid ${GOLD}`,
        height: 52,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setView('today')}
            style={gbtn({
              background: '#333',
              color: '#fff',
              border: 'none',
              fontSize: 12,
            })}
          >Today</button>
          <button
            onClick={() => setView('archive')}
            style={gbtn({
              background: GOLD,
              color: '#fff',
              border: 'none',
              fontSize: 12,
            })}
          >Archive</button>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ color: '#aaa', fontSize: 12 }}>{firstName}</span>
          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >Logout</button>
        </div>
      </div>

      {/* Body */}
      <div style={{
        padding: 20,
        maxWidth: 900,
        margin: '0 auto',
      }}>
        {dayCompleteDates.length === 0 ? (
          <div style={{
            padding: 40,
            textAlign: 'center',
            color: '#666',
            fontSize: 14,
          }}>
            No completed days yet
          </div>
        ) : (
          <div style={{
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            padding: 16,
          }}>
            {[...dayCompleteDates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)).map(iso => (
              <div key={iso} style={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: '10px 16px',
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>
                  {fmtIso(iso)}
                </span>
                <span style={{ color: '#ddb94a', fontSize: 12, fontWeight: 700 }}>
                  ✓ Day Complete
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
