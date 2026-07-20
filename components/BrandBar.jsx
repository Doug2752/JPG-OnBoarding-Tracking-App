import React from 'react';
import { GOLD, DARK } from '../utils/constants';

const LOGO_SRC = '/jpglogo.png';

export default function BrandBar({
  neverTwiceRead, setNeverTwice,
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderBottom: `4px solid ${GOLD}`,
        padding: '18px 20px',
      }}
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
