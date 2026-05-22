// weekly-modal.jsx — Weekly Plan modal with day tabs + template tasks

const DAYS = [
  { id: 'mon', short: 'Mon', long: 'Monday', num: 21 },
  { id: 'tue', short: 'Tue', long: 'Tuesday', num: 22 },
  { id: 'wed', short: 'Wed', long: 'Wednesday', num: 23, today: true },
  { id: 'thu', short: 'Thu', long: 'Thursday', num: 24 },
  { id: 'fri', short: 'Fri', long: 'Friday', num: 25 },
  { id: 'sat', short: 'Sat', long: 'Saturday', num: 26 },
  { id: 'sun', short: 'Sun', long: 'Sunday', num: 27 },
];

const TEMPLATE = {
  mon: ['Morning run', 'Stand-up @ 9:30', 'Water plants', 'Read 20 pages'],
  tue: ['Therapy', 'Stand-up @ 9:30', 'Cook dinner', 'Read 20 pages'],
  wed: ['Morning run', 'Stand-up @ 9:30', 'Cook dinner', 'Read 20 pages', 'Laundry'],
  thu: ['Therapy', 'Stand-up @ 9:30', 'Water plants', 'Read 20 pages'],
  fri: ['Morning run', 'Stand-up @ 9:30', 'Grocery run', 'Read 20 pages'],
  sat: ['Long run', 'Call Mom', 'Clean kitchen'],
  sun: ['Meal prep', 'Reset journal', 'Plan the week'],
};

const ONEOFFS = {
  thu: ['Buy birthday card for Jules'],
  fri: ['Pick up dry cleaning', 'Submit Q2 budget'],
  sat: ['Aram\'s wedding 4pm'],
};

function TemplateRow({ title, source = 'template', onRemove }) {
  const dot = source === 'template' ? '#7F77DD' : '#1D9E75';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px',
      background: '#fff', borderRadius: 12,
      boxShadow: '0 0.5px 0 rgba(0,0,0,0.06)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: dot, flexShrink: 0,
      }} />
      <span style={{
        flex: 1, fontSize: 15, fontWeight: 500,
        color: '#1a1a1a', letterSpacing: -0.2,
      }}>{title}</span>
      <button onClick={onRemove} style={{
        width: 22, height: 22, borderRadius: '50%',
        border: 0, background: 'rgba(60,60,67,0.08)',
        color: 'rgba(60,60,67,0.6)',
        fontSize: 14, lineHeight: 1, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>−</button>
    </div>
  );
}

function WeeklyModal({ open, onClose, currentDay = 'wed' }) {
  const [activeDay, setActiveDay] = React.useState(currentDay);
  React.useEffect(() => { if (open) setActiveDay(currentDay); }, [open, currentDay]);

  const day = DAYS.find(d => d.id === activeDay);
  const templates = TEMPLATE[activeDay] || [];
  const oneoffs = ONEOFFS[activeDay] || [];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: open ? 'auto' : 'none',
      zIndex: 100,
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20,15,5,0.4)',
        opacity: open ? 1 : 0,
        transition: 'opacity 240ms ease',
        backdropFilter: 'blur(2px)',
      }} />
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: '88%',
        background: '#FAF7F0',
        borderRadius: '24px 24px 0 0',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(.3,.7,.4,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Drag handle */}
        <div style={{
          alignSelf: 'center', marginTop: 8,
          width: 38, height: 5, borderRadius: 100,
          background: 'rgba(60,60,67,0.25)',
        }} />
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px 8px',
        }}>
          <div>
            <div style={{
              fontSize: 12, fontWeight: 700, letterSpacing: 1.4,
              color: 'rgba(60,60,67,0.55)', textTransform: 'uppercase',
            }}>Weekly Plan</div>
            <div style={{
              fontSize: 26, fontWeight: 700, letterSpacing: -0.6,
              color: '#1a1a1a', marginTop: 2,
            }}>April 21 – 27</div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: '50%',
            border: 0, background: 'rgba(60,60,67,0.08)',
            color: '#1a1a1a', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M2 2 L12 12 M12 2 L2 12" stroke="#1a1a1a"
                strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* Day tabs */}
        <div style={{
          display: 'flex', gap: 6, padding: '4px 16px 14px',
          overflowX: 'auto',
        }}>
          {DAYS.map(d => {
            const active = d.id === activeDay;
            return (
              <button key={d.id} onClick={() => setActiveDay(d.id)}
                style={{
                  flexShrink: 0,
                  width: 44, padding: '8px 0',
                  borderRadius: 12,
                  border: 0,
                  background: active ? '#1a1a1a' : 'transparent',
                  color: active ? '#fff' : '#1a1a1a',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 2,
                  position: 'relative',
                  fontFamily: '-apple-system, system-ui',
                }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  opacity: active ? 0.7 : 0.55,
                }}>{d.short}</span>
                <span style={{
                  fontSize: 17, fontWeight: 600, letterSpacing: -0.3,
                }}>{d.num}</span>
                {d.today && (
                  <span style={{
                    position: 'absolute', bottom: 4,
                    width: 4, height: 4, borderRadius: '50%',
                    background: active ? '#FFD86B' : '#378ADD',
                  }} />
                )}
              </button>
            );
          })}
        </div>
        {/* Day content */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '4px 16px 32px',
        }}>
          <div style={{
            fontSize: 22, fontWeight: 700, letterSpacing: -0.4,
            color: '#1a1a1a', marginBottom: 4,
          }}>{day.long}{day.today ? ' · today' : ''}</div>
          <div style={{
            fontSize: 13, color: 'rgba(60,60,67,0.55)',
            marginBottom: 14,
          }}>
            {templates.length + oneoffs.length} tasks · {templates.length} recurring
          </div>

          {/* Template section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7F77DD' }} />
            <SectionLabel>Recurring template</SectionLabel>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {templates.map((t, i) => <TemplateRow key={i} title={t} source="template" onRemove={() => {}} />)}
          </div>

          {/* Add task to template */}
          <button style={{
            marginTop: 8,
            padding: '10px 12px', borderRadius: 12,
            border: '1.5px dashed rgba(127,119,221,0.4)',
            background: 'rgba(127,119,221,0.04)',
            color: '#7F77DD', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 600, width: '100%',
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            Add recurring task to {day.short}
          </button>

          {/* One-offs section */}
          {oneoffs.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 22, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
                <SectionLabel>One-off · this week only</SectionLabel>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {oneoffs.map((t, i) => <TemplateRow key={i} title={t} source="one-off" onRemove={() => {}} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WeeklyModal });
