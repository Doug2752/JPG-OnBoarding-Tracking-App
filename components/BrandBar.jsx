import React from 'react';
import { GOLD, DARK, BORDER } from '../utils/constants';

const LOGO_SRC = '/jpglogo.png';

export default function BrandBar({
  startDate, fmtStart,
  dateOpen, setDateOpen,
  dateInputVal, onDateChange,
  neverTwiceRead, setNeverTwice,
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderBottom: `4px solid ${GOLD}`,
        padding: '18px 20px',
      }}
      onClick={() => setDateOpen(false)}
    >
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '260px auto 1fr',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Logo */}
        <img
          src={LOGO_SRC}
          alt="Jones Performance Group"
          style={{
            width: 260,
            height: 'auto',
            display: 'block',
          }}
        />

        {/* Center */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            marginBottom: 8,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 38,
              fontWeight: 900,
              color: '#000',
              lineHeight: 1,
            }}>OBT</div>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#000',
              letterSpacing: 0.5,
              marginTop: 3,
            }}>OnBoarding & Tracking</div>
          </div>

          {/* Start date picker */}
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: 10,
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setDateOpen(o => !o)}
              style={{
                background: '#fff',
                border: `1px solid ${GOLD}`,
                borderRadius: 5,
                padding: '4px 14px',
                fontSize: 12,
                fontWeight: 600,
                color: DARK,
                cursor: 'pointer',
                letterSpacing: 0.3,
              }}
            >
              {startDate
                ? fmtStart(startDate)
                : 'Set Start Date'}
              <span style={{
                marginLeft: 8,
                fontSize: 16,
                color: GOLD,
                lineHeight: 1,
              }}>▾</span>
            </button>
            {dateOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                boxShadow:
                  '0 4px 20px rgba(0,0,0,0.15)',
                padding: 12,
                minWidth: 260,
                zIndex: 200,
              }}>
                <input
                  type="date"
                  value={dateInputVal}
                  onChange={onDateChange}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: 8,
                  }}
                />
              </div>
            )}
          </div>

          {/* Never Twice */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              border: '1.5px solid #000',
              borderRadius: 5,
              padding: '5px 14px',
              background: GOLD,
            }}>
              <span style={{
                fontSize: 15,
                fontWeight: 900,
                color: '#000',
                letterSpacing: 1,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                fontFamily: "'Lato', 'Arial Black', sans-serif",
              }}>Never Twice</span>
              <span style={{
                fontSize: 8,
                fontWeight: 600,
                color: '#000',
                letterSpacing: 0.3,
                whiteSpace: 'nowrap',
              }}>
                Miss one — never miss the second.
              </span>
            </div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 700,
              color: DARK,
              letterSpacing: 0.3,
              marginTop: 6,
              userSelect: 'none',
            }}>
              <input
                type="checkbox"
                checked={neverTwiceRead}
                onChange={e =>
                  setNeverTwice(e.target.checked)}
                style={{
                  width: 13,
                  height: 13,
                  cursor: 'pointer',
                  accentColor: GOLD,
                }}
              />
              I've read this. Never twice.
            </label>
          </div>
        </div>

        {/* Right spacer */}
        <div style={{ width: 76 }} />
      </div>
    </div>
  );
}
