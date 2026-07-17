import React from 'react';
import { GOLD, DARK, MID } from '../utils/constants.js';

export default function InstructionsPanel({ onClose }) {
  const sections = [
    {
      title: 'Note from Doug',
      text: 'Welcome to Jones Performance Group. The fact that you are here means you have made a decision that most people never make — a decision to improve yourself and pursue something better. That decision matters. Congratulations on taking it.\n\nYou are now entering the first tier of the Jones Performance Group system. This path will require work, patience, consistency, and discipline. It will not be easy. But it will yield tangible, real-world outcomes that you can see and feel. Jones Performance Group is focused on your journey and, ultimately, your results. Those are the metrics that govern our success — yours and ours together. Once you complete this baseline tier, you will have the opportunity to move forward into your individualized plan, built specifically for you.\n\nLet\'s get to work.\n\n— Doug',
    },
    {
      title: 'Overview',
      text: 'The next 14 days are not about changing anything. They are about seeing clearly where you actually are. Honest data collected here becomes the foundation of everything that follows. There is no judgment — only information.\n\nWe are all different. Your individualized plan will be derived directly from this data. Complete each section daily. Do not skip days. Incomplete data produces an incomplete picture.',
    },
    {
      title: 'Client Information',
      text: 'Complete this section once at the start of your 14-day period. Be specific — vague answers produce ambiguity which may taint the results.',
    },
    {
      title: 'Section 01 — Nutrition',
      text: 'Record everything you eat and drink across three time blocks each day: AM, Midday, and PM. Be as descriptive as possible. Include portions, preparation method, and ingredients. A meal described as "grilled chicken sandwich, side salad, sparkling water" is useful. A meal described as "lunch" is not. A double-double cheeseburger from a fast food restaurant is a very different nutritional event than a cheeseburger prepared at home. The detail matters.\n\nDo not change what you eat during these 14 days. From past experience, some people will subconsciously alter their daily diet once they know they will be writing it down. Stay consistent with your normal habits. Eat what you normally eat.\n\nPress Return in any meal field to generate a calorie estimate. Use the Add Snack button to log anything eaten between meals — snacks, protein bars, fruit, or beverages outside of AM, Midday, and PM. Each snack generates its own calorie estimate and contributes to your daily total.\n\nWhen logging supplements, include the name and dosage — for example, Vitamin D3 — 5,000 IU or Magnesium Glycinate — 400mg. Dosage is required for supplement data to be meaningful.',
    },
    {
      title: 'Section 02 — Alcohol',
      text: 'Track all alcohol consumed each day. Beer is counted in 12-oz servings. Mixed drinks counted individually. Use Other / None for wine, spirits, or anything that does not fit the first two. If no alcohol was consumed, write None in that field. Do not leave any day blank.\n\nYears ago, Doug consumed alcohol regularly. Over time the cumulative effects became impossible to ignore: poor sleep, low energy, declining fitness. He made a decision to change. What began as a reduction eventually became full abstinence. Doug credits eliminating alcohol as one of the primary catalysts in a transformation that touched every area of his life. Being honest about your alcohol consumption here is not about judgment. It is about giving yourself — and your coach — an accurate picture of one of the most impactful variables in your performance.\n\nJones Performance Group is not a mandatory alcohol-free program. Many clients have made meaningful progress while still consuming alcohol at times. What matters here is honesty.',
    },
    {
      title: 'Section 03 — Fitness & Activity',
      text: 'Record all physical activity each day. Select from the dropdown or use Other to write in your activity. If you did nothing, select None. If you took a deliberate rest day as part of your recovery, select Rest. These are two different things — one is the absence of activity, the other is an intentional training decision. Both are valid data points, neither is a failure.\n\nLog the duration and rate the intensity using RPE — Rate of Perceived Exertion. This is a self-assessment of how hard you are pushing during a session. Do not inflate your scores.\n\n1–2: Very light. Minimal effort.\n3–4: Light. You can hold a full conversation.\n5–6: Moderate. You can speak in short sentences.\n7–8: Hard. Speaking is difficult.\n9–10: Maximum effort. Near your limit.\n\nAn estimated calorie burn is automatically calculated from activity type and duration.',
    },
    {
      title: 'Section 04 — Sleep',
      text: 'Enter bedtime, time to fall asleep, and wake time. Total Sleep Hours is auto-calculated from these inputs. Units are pre-set to the most common values (PM for bedtime, AM for wake time, minutes for durations) — tap the unit button to change if you are an outlier. You can also enter Total Sleep Hours manually if the calculated value needs adjustment.\n\nSleep and sleep quality are among the most underrated factors in human performance. Most people do not know what their sleep actually looks like until they track it. This data is critical.',
    },
    {
      title: 'Section 05 — Time & Life',
      text: 'Complete at the end of each day. Log your work schedule. In the Non-Negotiables field, record the personal commitments you held to that day. Non-negotiables are things you do not compromise on — they are personal and will look different for everyone. Use the Add button to log multiple non-negotiables. Select None if you do not yet have defined non-negotiables.\n\nTrack screen time in two categories: Social Media Scrolling and Other (TV, computer, or phone not related to social media). Log Family Time and PIT — Personal Investment Time — in hours and minutes.\n\nPIT is time spent deliberately investing in your own growth: reading, studying, journaling, meditation, or any intentional self-development. Record whatever time you are currently spending on yourself. If it is zero, log zero.\n\nComplete the PM Check-In by rating your day 1 to 10. Then identify Tomorrow\'s One Thing — the single task that by completing or starting it makes everything else easier or unnecessary. This field is required. Starting Day 2, check whether you completed Yesterday\'s One Thing.',
    },
    {
      title: 'Weekly Reflection',
      text: 'Complete Week 1 reflection at the end of Day 7, and Week 2 at the end of Day 14. These questions surface patterns that daily entries alone cannot capture. Answer thoughtfully.',
    },
    {
      title: 'Summary Results',
      text: 'This section auto-populates from your daily entries. No additional input required. Your performance score, sleep totals, and estimated calorie data are compiled here and will be reviewed with your coach to build your Phase 2 plan.\n\nYour performance band and sleep recovery band are a starting point — not a verdict.',
    },
  ];

  return (
    <div style={{ background: '#E0E0E0', border: `2px solid ${GOLD}`,
        borderRadius: 8, padding: '18px 20px', marginBottom: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative',
        maxWidth: 700, margin: '0 auto', marginTop: 12 }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: DARK,
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20,
        paddingBottom: 8, borderBottom: `2px solid ${GOLD}` }}>
        OBT — Set-Up and Instructions
      </div>
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 14, right: 16,
          background: 'transparent', border: 'none', fontSize: 16,
          cursor: 'pointer', color: DARK, fontWeight: 700,
          lineHeight: 1, padding: 0 }}
        aria-label="Close"
      >✕</button>

        {sections.map(({ title, text }) => (
          <div key={title} style={{ marginBottom: '18px', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start',
              marginBottom: 5 }}>
              <span style={{ color: GOLD, fontWeight: 700,
                minWidth: 14, flexShrink: 0 }}>•</span>
              <div style={{ fontSize: 13, fontWeight: 800,
                color: DARK, marginBottom: 3 }}>{title}</div>
            </div>
            {text.split('\n\n').map((p, i) => (
              <p key={i} style={{ fontSize: '12px', color: MID, lineHeight: '1.75', marginBottom: '6px' }}>{p}</p>
            ))}
          </div>
        ))}

    </div>
  );
}
