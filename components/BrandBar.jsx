import React from 'react';
import { GOLD, DARK } from '../utils/constants';

const LOGO_SRC = '/jpglogo.png';

export default function BrandBar({
  neverTwiceRead, setNeverTwice, user,
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
        gridTemplateColumns: '260px auto 240px',
        alignItems: 'flex-start',
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

        {(() => {
          const tier = (() => {
            try {
              const val = localStorage.getItem(`${(user || '').toLowerCase()}_ob6_tier`);
              return val ? parseInt(val, 10) : 4;
            } catch { return 4; }
          })();

          const tierNames = { 1: 'UNSTOPPABLE', 2: 'GREATNESS', 3: 'PERFORMANCE', 4: 'APPRENTICE' };
          const tierName = tierNames[tier] || 'APPRENTICE';
          const patchSrc = `/LIMITLESS_Tier_${tier}_Patch.png`;

          const clientInfoRaw = (() => {
            try { return JSON.parse(localStorage.getItem(`${(user || '').toLowerCase()}_ob6_clientInfo`) || '{}'); }
            catch { return {}; }
          })();

          const fullName = clientInfoRaw.fullName || '';
          const parts = fullName.trim().split(/\s+/);
          const nameLabel = parts.length >= 2
            ? `${parts[0][0].toUpperCase()}. ${parts[parts.length - 1]}`
            : fullName || user || '';

          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 0 }}>
              <div style={{ background: '#FFFFFF', display: 'inline-block', lineHeight: 0 }}>
                <img
                  src={patchSrc}
                  alt={`Tier ${tier} patch`}
                  style={{ width: 220, height: 'auto', display: 'block', border: 'none', outline: 'none' }}
                />
              </div>
              <div style={{
                marginTop: 2,
                fontSize: 9,
                fontWeight: 700,
                color: '#000',
                letterSpacing: 0.5,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}>
                TIER {tier} | {tierName} | {nameLabel}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
