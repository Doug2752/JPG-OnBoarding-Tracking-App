// ── STYLES ────────────────────────────────────────────────────
import {
  GOLD, GOLD_DARK, GOLD_LIGHT,
  BG, DARK, CHARCOAL, MID, BORDER,
  STEEL, STEEL_MID, STEEL_LIGHT,
  GREEN, GREEN_LIGHT, ORANGE, RED
} from './constants.js';

export const S = {
  // ── App shell ───────────────────────────────────────────────
  app: {
    minHeight: '100vh', background: BG,
    fontFamily: "'Gill Sans MT','Gill Sans',Calibri,sans-serif", color: DARK
  },

  // ── Content ─────────────────────────────────────────────────
  content: { maxWidth: '900px', margin: '0 auto', padding: '18px 12px 90px' },

  // ── Block headers ────────────────────────────────────────────
  blockGold:     { background: GOLD,     color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  blockSteel:    { background: STEEL,    color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  blockGreen:    { background: GREEN,    color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  blockDark:     { background: DARK,     color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  blockCharcoal: { background: CHARCOAL, color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  blockBurgundy: { background: '#7B3055', color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  blockPurple:   { background: '#4A3575', color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  blockOrange:   { background: '#7A4418', color: '#fff', padding: '8px 14px', borderRadius: '4px 4px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },

  // ── Card ─────────────────────────────────────────────────────
  card: { background: '#fff', border: '1px solid ' + BORDER, borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '14px', marginBottom: '16px' },

  // ── Info boxes ───────────────────────────────────────────────
  infoBox:      { background: GOLD_LIGHT,  border: '1px solid ' + GOLD,  borderRadius: '4px', padding: '10px 13px', marginBottom: '12px', fontSize: '12px', color: MID, lineHeight: '1.7' },
  infoBoxGreen: { background: GREEN_LIGHT, border: '1px solid ' + GREEN, borderRadius: '4px', padding: '10px 13px', marginBottom: '12px', fontSize: '12px', color: MID, lineHeight: '1.7' },
  infoBoxSteel:    { background: STEEL_LIGHT, border: '1px solid ' + STEEL, borderRadius: '4px', padding: '10px 13px', marginBottom: '12px', fontSize: '12px', color: MID, lineHeight: '1.7' },
  infoBoxBurgundy: { background: '#f5eef1', border: '1px solid #7B3055', borderRadius: 4, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#555' },
  infoBoxPurple:   { background: '#eeeaf5', border: '1px solid #4A3575', borderRadius: 4, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#555' },
  infoBoxOrange:   { background: '#f5ede6', border: '1px solid #7A4418', borderRadius: 4, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#555' },

  // ── Form fields ──────────────────────────────────────────────
  field:    { marginBottom: '11px' },
  label:    { display: 'block', fontSize: '11px', fontWeight: '600', color: MID, marginBottom: '3px', letterSpacing: '0.5px' },
  labelSm:  { display: 'block', fontSize: '10px', fontWeight: '400', color: '#888', marginBottom: '3px', fontStyle: 'italic' },
  input:    { width: '100%', padding: '8px 10px', border: '1px solid ' + BORDER, borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' },
  textarea: { width: '100%', padding: '8px 10px', border: '1px solid ' + BORDER, borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', minHeight: '58px', boxSizing: 'border-box', background: '#fff' },
  select:   { width: '100%', padding: '8px 10px', border: '1px solid ' + BORDER, borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' },

  // ── Grids ────────────────────────────────────────────────────
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' },

  // ── Day picker ───────────────────────────────────────────────
  dayPicker: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' },
  dayTag:    { display: 'inline-block', background: GOLD_LIGHT, border: '1px solid ' + GOLD, borderRadius: '4px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', color: GOLD_DARK, marginBottom: '8px' },
  dayTagBurgundy: { display: 'inline-block', background: '#F5EEF3', border: '1px solid #7B3055', borderRadius: '4px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', color: '#7B3055', marginBottom: '8px' },
  dayTagPurple:   { display: 'inline-block', background: '#EEEAF5', border: '1px solid #4A3575', borderRadius: '4px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', color: '#4A3575', marginBottom: '8px' },
  dayTagOrange:   { display: 'inline-block', background: '#F5EDE8', border: '1px solid #7A4418', borderRadius: '4px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', color: '#7A4418', marginBottom: '8px' },
  dayTagGreen:    { display: 'inline-block', background: '#E8F2EE', border: '1px solid #2E5A4B', borderRadius: '4px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', color: '#2E5A4B', marginBottom: '8px' },
  dayTagSteel:    { display: 'inline-block', background: '#E8EEF2', border: '1px solid #3A5A78', borderRadius: '4px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', color: '#3A5A78', marginBottom: '8px' },

  // ── Rating buttons ───────────────────────────────────────────
  ratingRow: { display: 'flex', flexWrap: 'wrap', gap: '4px' },
  ratingBtn: { width: '33px', height: '33px', border: '2px solid ' + BORDER, borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', background: '#fff', fontFamily: 'inherit', color: MID },

  // ── PM block ─────────────────────────────────────────────────
  pmBlock:   { background: STEEL_MID, borderRadius: '4px', padding: '12px', marginTop: '12px' },
  pmEyebrow: { fontSize: '10px', letterSpacing: '2px', color: STEEL_LIGHT, textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' },
  pmTotBox:  { background: STEEL, borderRadius: '4px', padding: '6px 12px', display: 'inline-block' },

  // ── One Thing block ──────────────────────────────────────────
  oneThingBlock: { background: '#fff', border: '2px solid ' + RED, borderRadius: '4px', padding: '12px', marginTop: '12px' },

  // ── Sleep Quality block ──────────────────────────────────────
  sleepQualityBlock: { background: GREEN, borderRadius: '4px', padding: '12px', marginTop: '12px' },

  // ── Fitness RPE block ────────────────────────────────────────
  fitnessRpeBlock: { background: ORANGE, borderRadius: '4px', padding: '12px', marginTop: '12px' },

  // ── Additional / chips ───────────────────────────────────────
  addlWrap:  { marginTop: '12px', paddingTop: '12px', borderTop: '1px solid ' + BORDER },
  addlLabel: { fontSize: '10px', fontWeight: '700', color: MID, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' },
  chipWrap:  { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' },
  chip:      { background: GOLD_LIGHT, border: '1px solid ' + GOLD, borderRadius: '12px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', color: GOLD_DARK, display: 'flex', alignItems: 'center', gap: '4px' },
  chipBurgundy: { background: '#F5EEF3', border: '1px solid #7B3055', borderRadius: '12px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', color: '#7B3055', display: 'flex', alignItems: 'center', gap: '4px' },
  chipX:     { background: 'none', border: 'none', cursor: 'pointer', color: GOLD_DARK, fontWeight: '700', fontSize: '13px', lineHeight: '1', padding: '0' },
  chipXBurgundy: { background: 'none', border: 'none', cursor: 'pointer', color: '#7B3055', fontWeight: '700', fontSize: '13px', lineHeight: '1', padding: '0' },

  // ── Supplement panel ─────────────────────────────────────────
  suppPanel:      { border: '1px solid ' + BORDER, borderRadius: '4px', background: '#fff', maxHeight: '220px', overflowY: 'auto', marginBottom: '6px' },
  suppCat:        { background: '#f5f5f3', padding: '6px 10px', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: MID, cursor: 'pointer', borderBottom: '1px solid ' + BORDER, textTransform: 'uppercase' },
  suppItem:       { padding: '5px 14px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', color: DARK },
  suppRecent:     { background: GOLD_LIGHT, padding: '5px 10px', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: GOLD_DARK, borderBottom: '1px solid ' + GOLD },
  suppRecentBurgundy: { background: '#F5EEF3', padding: '5px 10px', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#7B3055', borderBottom: '1px solid #7B3055' },
  suppRecentItem: { padding: '4px 14px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid #f5e6c8', color: GOLD_DARK, background: GOLD_LIGHT },
  suppRecentItemBurgundy: { padding: '4px 14px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid #e8d4df', color: '#7B3055', background: '#F5EEF3' },

  // ── Calorie display ──────────────────────────────────────────
  calEst:   { fontSize: '11px', color: '#777', fontStyle: 'italic', marginTop: '4px', padding: '4px 8px', background: '#f8f8f6', borderRadius: '3px', borderLeft: '3px solid ' + GOLD },
  calTotal: { background: DARK, borderRadius: '4px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  calLabel: { fontSize: '10px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' },
  calValue: { fontSize: '18px', fontWeight: '700', color: GOLD },

  // ── Buttons ──────────────────────────────────────────────────
  copyBtn: { background: 'none', border: '1px solid ' + GOLD, borderRadius: '4px', padding: '5px 10px', fontSize: '11px', fontWeight: '600', color: GOLD, cursor: 'pointer', fontFamily: 'inherit' },
  copyBtnBurgundy: { border: '1px solid #7B3055', color: '#7B3055', background: 'none', borderRadius: '4px', padding: '3px 10px', fontSize: '12px', cursor: 'pointer' },
  unitBtn: { background: 'none', border: '1px solid ' + GOLD, borderRadius: '3px', color: GOLD, fontSize: '10px', fontWeight: '700', cursor: 'pointer', padding: '1px 6px', fontFamily: 'inherit', marginLeft: '4px', flexShrink: 0, whiteSpace: 'nowrap' },

  // ── Save note ────────────────────────────────────────────────
  saveNote: { fontSize: '11px', color: '#888', fontStyle: 'italic', marginTop: '6px' },

  // ── Footer ───────────────────────────────────────────────────
  footer: { borderTop: '1px solid ' + BORDER, padding: '7px 14px', fontSize: '10px', color: '#9A9A9A', letterSpacing: '1px', textAlign: 'center', background: '#fff', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90 },

  // ── Totals bar (sleep) ───────────────────────────────────────
  totalsBar:     { border: '1px solid ' + GREEN, borderRadius: '4px', overflow: 'hidden', marginTop: '12px' },
  totalsBarHdr:  { background: GREEN, padding: '7px 14px', fontSize: '10px', letterSpacing: '2px', color: '#a0c4b8', fontWeight: '700', textTransform: 'uppercase' },
  totalsBarBody: { background: GREEN_LIGHT, padding: '10px 14px' },
  totalsCell:    { background: 'rgba(46,90,75,0.1)', border: '1px solid rgba(46,90,75,0.2)', borderRadius: '4px', padding: '8px', textAlign: 'center' },
  totalsCellVal: { fontSize: '18px', fontWeight: '700', color: GREEN },
  totalsCellLbl: { fontSize: '9px', color: GREEN, letterSpacing: '1px', marginTop: '2px', textTransform: 'uppercase' }
};

