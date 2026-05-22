// app.jsx — root Task-a-gotchi prototype

const STATE_META = {
  thriving: { label: 'Thriving', subtitle: 'Your pet is glowing.', tint: '#FFF6E0', accent: '#46A65A' },
  happy:    { label: 'Happy',    subtitle: 'Cruising along.',       tint: '#FFF6E0', accent: '#D9A82E' },
  neutral:  { label: 'Neutral',  subtitle: 'Backlog is building.',  tint: '#F1EFE6', accent: '#7E7E69' },
  anxious:  { label: 'Anxious',  subtitle: 'Pet is worried.',       tint: '#FBEDE3', accent: '#D85A30' },
  sick:     { label: 'Sick',     subtitle: 'Pet needs help.',       tint: '#ECEFE6', accent: '#5A6F5A' },
  dead:     { label: 'Ghost',    subtitle: '3 tasks to revive.',    tint: '#EEECF2', accent: '#7F77DD' },
};

const stateForHealth = (h, deadHours) => {
  if (deadHours >= 48) return 'dead';
  if (h >= 90) return 'thriving';
  if (h >= 70) return 'happy';
  if (h >= 50) return 'neutral';
  if (h >= 25) return 'anxious';
  if (h >= 1)  return 'sick';
  return 'sick';
};

const healthColor = (h) => {
  if (h >= 70) return '#639922';
  if (h >= 45) return '#A8B22B';
  if (h >= 25) return '#EF9F27';
  return '#E24B4A';
};

// Initial task seed (for the prototype)
// ─────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  // overdue carryovers
  { id: 'o1', title: 'Reply to Sam about Q2 budget', overdue: true, overdueFrom: 'Monday', overduePoints: 25, source: 'template', completed: false },
  { id: 'o2', title: 'Submit expense report',          overdue: true, overdueFrom: 'Tuesday', overduePoints: 20, source: 'one-off',   completed: false },
  { id: 'o3', title: 'Water plants',                   overdue: true, overdueFrom: 'Wednesday', overduePoints: 15, source: 'template', completed: false },
  // today
  { id: 't1', title: 'Morning run',          overdue: false, source: 'template', completed: true },
  { id: 't2', title: 'Stand-up @ 9:30',      overdue: false, source: 'template', completed: true },
  { id: 't3', title: 'Therapy',              overdue: false, source: 'template', completed: false },
  { id: 't4', title: 'Cook dinner',          overdue: false, source: 'template', completed: false },
  { id: 't5', title: 'Read 20 pages',        overdue: false, source: 'template', completed: false },
  { id: 't6', title: 'Buy birthday card for Jules', overdue: false, source: 'one-off', completed: false },
];

// Health is derived from overdue tasks via the spec's formula.
function computeHealth(tasks) {
  const overdue = tasks.filter(t => t.overdue && !t.completed);
  let pen = 0;
  overdue.forEach(t => { pen += t.overduePoints; });
  const today = tasks.filter(t => !t.overdue);
  const todayDone = today.length > 0 && today.every(t => t.completed);
  const bonus = todayDone ? 5 : 0;
  return Math.max(0, Math.min(100, 100 - pen + bonus));
}

// ─────────────────────────────────────────────────────────────
// FAB / inline add bar
// ─────────────────────────────────────────────────────────────
function AddBar({ onAdd, keyboard, setKeyboard }) {
  const [value, setValue] = React.useState('');
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: keyboard ? 0 : 38,
      transition: 'bottom 260ms cubic-bezier(.3,.7,.4,1)',
      zIndex: 30,
    }}>
      {keyboard ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 18,
          padding: '8px 8px 8px 14px',
          boxShadow: '0 8px 24px rgba(20,15,5,0.14), 0 0 0 0.5px rgba(20,15,5,0.08)',
          margin: '0 4px 12px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) { onAdd(value.trim()); setValue(''); setKeyboard(false); }
              if (e.key === 'Escape') { setKeyboard(false); }
            }}
            placeholder="Add a task to today…"
            style={{
              flex: 1, border: 0, outline: 'none',
              fontSize: 16, fontFamily: '-apple-system, system-ui',
              background: 'transparent',
              padding: '6px 0',
            }} />
          <button onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(''); setKeyboard(false); } }}
            style={{
              padding: '8px 14px', borderRadius: 12,
              background: value.trim() ? '#1a1a1a' : 'rgba(60,60,67,0.12)',
              color: value.trim() ? '#fff' : 'rgba(60,60,67,0.5)',
              border: 0, fontSize: 14, fontWeight: 600,
              cursor: value.trim() ? 'pointer' : 'default',
            }}>Add</button>
        </div>
      ) : (
        <button onClick={() => setKeyboard(true)} style={{
          float: 'right',
          width: 56, height: 56, borderRadius: '50%',
          background: '#1a1a1a',
          color: '#fff', border: 0, cursor: 'pointer',
          fontSize: 28, fontWeight: 300, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(20,15,5,0.28), 0 0 0 4px rgba(255,255,255,0.5)',
        }}>+</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top bar (above egg) — gear + streak + name
// ─────────────────────────────────────────────────────────────
function TopBar({ onOpenWeekly, petName, streak }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px 6px',
    }}>
      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
          color: 'rgba(60,60,67,0.55)', textTransform: 'uppercase',
        }}>Thu Apr 23 · day {streak} streak</div>
        <div style={{
          fontSize: 22, fontWeight: 700, letterSpacing: -0.4,
          color: '#1a1a1a', marginTop: 1,
        }}>{petName}</div>
      </div>
      <button onClick={onOpenWeekly} style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(255,255,255,0.85)',
        border: '0.5px solid rgba(60,60,67,0.12)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(20,15,5,0.06)',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="#1a1a1a" strokeWidth="1.5"/>
          <path d="M3 8h14" stroke="#1a1a1a" strokeWidth="1.5"/>
          <path d="M7 3v3M13 3v3" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="6" y="10.5" width="2.2" height="2.2" rx="0.4" fill="#378ADD"/>
          <rect x="9.4" y="10.5" width="2.2" height="2.2" rx="0.4" fill="#7F77DD"/>
          <rect x="12.8" y="10.5" width="2.2" height="2.2" rx="0.4" fill="#1D9E75"/>
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main screen (everything inside the device frame)
// ─────────────────────────────────────────────────────────────
function MainScreen({ t, setTweak }) {
  const [tasks, setTasks] = React.useState(INITIAL_TASKS);
  const [keyboard, setKeyboard] = React.useState(false);
  const [weeklyOpen, setWeeklyOpen] = React.useState(false);
  const [menu, setMenu] = React.useState('check');
  // Button effects: 'purr' (hearts), 'feed' (food bowl), or null
  const [effect, setEffect] = React.useState(null);
  const [toast, setToast] = React.useState({ visible: false, message: '' });
  const [chooserOpen, setChooserOpen] = React.useState(false);
  const seenMaxRef = React.useRef(false);

  // Tweak overrides: if a state is forced, use it; otherwise compute from health
  const computedHealth = computeHealth(tasks);
  const health = t.forceState !== 'auto' ? ({
    thriving: 95, happy: 80, neutral: 60, anxious: 35, sick: 12, dead: 0,
  }[t.forceState]) : computedHealth;
  const deadHours = t.forceState === 'dead' ? 60 : 0;
  const state = stateForHealth(health, deadHours);
  const meta = STATE_META[state];
  const palette = DEVICE_PALETTES[t.colorway] || DEVICE_PALETTES.butter;

  // Energy = % of today's tasks completed. Focus = streak length normalized.
  const todayTasks = tasks.filter(x => !x.overdue);
  const todayDone = todayTasks.filter(x => x.completed).length;
  const energy = todayTasks.length === 0 ? 0
    : Math.round((todayDone / todayTasks.length) * 100);
  const focus = Math.min(100, Math.round((t.streak / 21) * 100));

  // Auto-open character chooser the first time HP hits 100 in a session.
  React.useEffect(() => {
    if (health >= 100 && !seenMaxRef.current) {
      seenMaxRef.current = true;
      const id = setTimeout(() => setChooserOpen(true), 400);
      return () => clearTimeout(id);
    }
    if (health < 100) seenMaxRef.current = false;
  }, [health]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(x => x.id === id ? { ...x, completed: !x.completed } : x));
  };
  const addTask = (title) => {
    setTasks(prev => [
      ...prev,
      { id: 'n' + Math.random().toString(36).slice(2, 7), title, overdue: false, source: 'one-off', completed: false },
    ]);
  };

  // Trigger an effect with auto-clear
  const playEffect = (kind, duration = 1500) => {
    setEffect(kind);
    setTimeout(() => setEffect(null), duration);
  };

  // Button handlers
  const onA = () => playEffect('purr', 1500);              // affection — hearts
  const onB = () => playEffect('feed', 1700);              // feed — no HP change
  const onC = () => {
    setToast({ visible: true, message: pickMessage() });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3200);
  };

  const characterDef = CHARACTERS[t.character] || CHARACTERS.blip;

  return (
    <div style={{
      position: 'relative', height: '100%', width: '100%',
      background: '#FAF7F0',
      display: 'flex', flexDirection: 'column',
      paddingTop: 50, // status bar
    }}>
      {/* HP bar + character name above the egg */}
      <HPHeader
        hp={health}
        deadHours={deadHours}
        characterName={characterDef.label}
        state={meta.label}
        streak={t.streak}
        canChoose={health >= 100}
        onOpenChooser={() => setChooserOpen(true)}
      />

      {/* Device + LCD section */}
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        paddingTop: 6, paddingBottom: 8,
      }}>
        <DeviceShell palette={palette}>
          <DeviceHeader title="TASK-O-GOTCHI" level={t.streak} subtitle="POCKET PAL" />
          <LCDScreen>
            <LCDTopRow overdueCount={tasks.filter(t => t.overdue && !t.completed).length} />
            {/* Pet stage */}
            <div style={{
              position: 'absolute',
              top: 26, bottom: 56, left: 0, right: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4,
            }}>
              <div style={{ position: 'relative', width: 110, height: 110 }}>
                <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                  // Scale pulse when 'purr' effect is active
                  animation: effect === 'purr' ? 'petPurr 0.7s ease-in-out infinite' : 'none',
                }}>
                  <style>{`
                    @keyframes petPurr {
                      0%, 100% { transform: translate(-50%, -50%) scale(1); }
                      50%      { transform: translate(-50%, -50%) scale(1.06); }
                    }
                  `}</style>
                  <PetSprite character={t.character} state={state} cell={6} monochrome={true} inkColor={LCD_INK} />
                </div>
              </div>
              <PetPlatform state={state} />
            </div>
            {state === 'dead' && <RevivalChip revival={1} />}
            {/* Effect overlays */}
            <HeartsBurst visible={effect === 'purr'} ink={LCD_INK} />
            <FoodBowl visible={effect === 'feed'} ink={LCD_INK} />
            <LCDActionRow selected={menu} onSelect={setMenu} />
            <LCDStatBars hp={health} en={energy} fc={focus} />
          </LCDScreen>
          <DeviceButtons onA={onA} onB={onB} onC={onC} />
        </DeviceShell>
      </div>

      {/* Task list */}
      <div style={{
        flex: 1, overflow: 'auto',
        background: 'linear-gradient(180deg, #FAF7F0 0%, #F4EFE2 100%)',
        borderTop: '0.5px solid rgba(60,60,67,0.08)',
      }}>
        <TaskList tasks={tasks} onToggle={toggleTask} />
      </div>

      <AddBar onAdd={addTask} keyboard={keyboard} setKeyboard={setKeyboard} />

      {/* Open weekly via a small floating gear in the top-right corner */}
      <button onClick={() => setWeeklyOpen(true)} style={{
        position: 'absolute', top: 56, right: 18, zIndex: 5,
        width: 32, height: 32, borderRadius: 8,
        background: 'rgba(255,255,255,0.9)',
        border: '0.5px solid rgba(60,60,67,0.12)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(20,15,5,0.06)',
      }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="#1a1a1a" strokeWidth="1.5"/>
          <path d="M3 8h14" stroke="#1a1a1a" strokeWidth="1.5"/>
          <path d="M7 3v3M13 3v3" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <MessageToast message={toast.message} visible={toast.visible} />
      <WeeklyModal open={weeklyOpen} onClose={() => setWeeklyOpen(false)} />
      <CharacterChooser
        open={chooserOpen}
        current={t.character}
        onClose={() => setChooserOpen(false)}
        onPick={(k) => {
          setTweak({ character: k, petName: CHARACTERS[k].label });
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "forceState": "auto",
  "petName": "Blip",
  "streak": 12,
  "colorway": "butter",
  "character": "blip"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '40px 20px 60px',
      background: 'radial-gradient(ellipse at 50% 0%, #f8f4e8 0%, #e8e2d2 100%)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      boxSizing: 'border-box',
    }}>
      <IOSDevice width={402} height={874}>
        <MainScreen t={t} setTweak={setTweak} />
      </IOSDevice>

      <TweaksPanel>
        <TweakSection label="Pet" />
        <TweakRadio label="Character" value={t.character}
          options={['blip', 'buni', 'nova']}
          onChange={(v) => setTweak('character', v)} />
        <TweakSelect label="Pet state" value={t.forceState}
          options={[
            { value: 'auto',     label: 'Auto (from tasks)' },
            { value: 'thriving', label: 'Thriving (95)' },
            { value: 'happy',    label: 'Happy (80)' },
            { value: 'neutral',  label: 'Neutral (60)' },
            { value: 'anxious',  label: 'Anxious (35)' },
            { value: 'sick',     label: 'Sick (12)' },
            { value: 'dead',     label: 'Ghost / dead' },
          ]}
          onChange={(v) => setTweak('forceState', v)} />
        <TweakText label="Pet name" value={t.petName}
          onChange={(v) => setTweak('petName', v)} />
        <TweakSlider label="Streak" value={t.streak} min={0} max={365}
          onChange={(v) => setTweak('streak', v)} unit=" d" />
        <TweakSection label="Device" />
        <TweakSelect label="Colorway" value={t.colorway}
          options={[
            { value: 'butter', label: 'Butter · yellow' },
            { value: 'mint',   label: 'Mint · sage' },
            { value: 'coral',  label: 'Coral · pink' },
            { value: 'sky',    label: 'Sky · blue' },
            { value: 'ube',    label: 'Ube · purple' },
          ]}
          onChange={(v) => setTweak('colorway', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
