import React from 'react';
import { GOLD, DARK } from '../utils/constants';

export default function BrandBar({ dayNumber, calendarDate }) {
  return (
    <div style={{
      background: '#fff',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: 52,
          fontWeight: 900,
          color: DARK,
          lineHeight: 1,
        }}>
          DAY {dayNumber}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: DARK,
            letterSpacing: 0.5,
          }}>
            Onboarding & Tracking
          </div>
          {calendarDate && (
            <div style={{
              fontSize: 14,
              color: '#666',
              marginTop: 4,
            }}>
              {calendarDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
