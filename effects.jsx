// effects.jsx — pet interaction effects + HP bar header + character chooser

const MOTIVATIONAL_MESSAGES = [
  "you're doing great. proud of you.",
  "one task. that's all. then a break.",
  "the dishes will wait. you won't.",
  "drink some water, friend.",
  "you survived monday. ride or die.",
  "small wins still count. all of them.",
  "the inbox is not a person.",
  "tomorrow you. would. love. this.",
  "rest is not a reward. it's the fuel.",
  "let the perfectionism go. just start.",
  "you closed 6 tabs already. legend.",
  "your past self is rooting for you.",
  "the world's most productive cat is a nap.",
  "deep breath. shoulders down. begin.",
  "be the project manager of your own joy.",
];

function pickMessage() {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}

// ─────────────────────────────────────────────────────────────
// HeartsBurst — overlay shown on the LCD when A is pressed.
// Spawns 5 pixel hearts floating up around the pet.
// ─────────────────────────────────────────────────────────────
function HeartsBurst({ visible, ink = '#1F2410' }) {
  if (!visible) return null;
  const heart = (
    <div style={{
      width: 10, height: 9,
      background: ink,
      clipPath: 'polygon(0% 30%, 30% 0%, 50% 25%, 70% 0%, 100% 30%, 50% 100%)',
    }} />
  );
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      zIndex: 5,
    }}>
      <style>{`
        @keyframes heartFloat {
          0%   { transform: translateY(20px) scale(0.4); opacity: 0; }
          15%  { transform: translateY(10px) scale(1); opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-60px) scale(0.85); opacity: 0; }
        }
      `}</style>
      {[
        { left: '28%', delay: 0 },
        { left: '46%', delay: 0.18 },
        { left: '60%', delay: 0.36 },
        { left: '36%', delay: 0.5 },
        { left: '70%', delay: 0.62 },
      ].map((h, i) => (
        <div key={i} style={{
          position: 'absolute', left: h.left, top: '55%',
          animation: `heartFloat 1.4s ease-out ${h.delay}s forwards`,
        }}>{heart}</div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FoodBowl — small pixel bowl that appears under pet when fed.
// Pet does a little "eat" bob (we just animate the bowl appearing
// and shrinking; the pet's idle loop continues independently).
// ─────────────────────────────────────────────────────────────
function FoodBowl({ visible, ink = '#1F2410' }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 60,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 5,
    }}>
      <style>{`
        @keyframes foodPop {
          0%   { transform: scale(0) translateY(10px); opacity: 0; }
          20%  { transform: scale(1.1) translateY(0); opacity: 1; }
          80%  { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(0.85) translateY(2px); opacity: 0; }
        }
        @keyframes foodSteam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          40% { opacity: 0.7; }
          100% { transform: translateY(-12px) scaleX(0.6); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: 'relative', width: 30, height: 22,
        animation: 'foodPop 1.6s ease-out forwards',
      }}>
        {/* bowl */}
        <div style={{
          position: 'absolute', bottom: 0, left: 2, right: 2,
          height: 10,
          background: ink,
          clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
        }} />
        {/* food on top */}
        <div style={{
          position: 'absolute', bottom: 8, left: 6, right: 6,
          height: 4, background: ink, borderRadius: '50% 50% 0 0',
        }} />
        {/* steam wisps */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: 'absolute', bottom: 14, left: 8 + i * 6,
            width: 2, height: 6, background: ink,
            animation: `foodSteam 1.1s ease-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MessageToast — speech-bubble pixel toast above the device,
// shown when C is pressed.
// ─────────────────────────────────────────────────────────────
function MessageToast({ message, visible }) {
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, top: 4,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 30,
      transform: visible ? 'translateY(0)' : 'translateY(-12px)',
      opacity: visible ? 1 : 0,
      transition: 'all 280ms cubic-bezier(.3,.7,.4,1)',
    }}>
      <div style={{
        position: 'relative', maxWidth: 280,
        background: '#1F2410', color: '#E8E7D8',
        padding: '10px 14px 12px',
        borderRadius: 14,
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
        textAlign: 'center',
        lineHeight: 1.35,
        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
      }}>
        {message}
        {/* speech tail */}
        <div style={{
          position: 'absolute', bottom: -6, left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: 12, height: 12, background: '#1F2410',
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HPHeader — fancier HP bar above the device, with character
// name + 24-segment bar.
// ─────────────────────────────────────────────────────────────
function HPHeader({ hp, deadHours, characterName, state, streak, onOpenChooser, canChoose }) {
  const isDead = deadHours >= 48;
  const segs = 24;
  const filled = Math.round((hp / 100) * segs);
  // pixel bar color
  const barColor =
    hp >= 70 ? '#3B7A2C' :
    hp >= 45 ? '#7E7414' :
    hp >= 25 ? '#A85618' : '#B83524';

  return (
    <div style={{
      padding: '6px 18px 4px',
      display: 'flex', flexDirection: 'column', gap: 5,
    }}>
      {/* Top row: pet name + state + chooser */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          <span style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 16, fontWeight: 800, letterSpacing: 0.4,
            color: '#1a1a1a',
          }}>{characterName.toUpperCase()}</span>
          <span style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
            color: 'rgba(60,60,67,0.55)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>· {state} · day {streak}</span>
        </div>
        <button
          onClick={onOpenChooser}
          disabled={!canChoose}
          style={{
            padding: '4px 8px', borderRadius: 6,
            border: 0, cursor: canChoose ? 'pointer' : 'default',
            background: canChoose ? '#1a1a1a' : 'rgba(60,60,67,0.08)',
            color: canChoose ? '#fff' : 'rgba(60,60,67,0.4)',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
          {canChoose ? '↻ change' : 'lv max @ 100'}
        </button>
      </div>
      {/* Pixel HP bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 11, fontWeight: 800,
          color: '#1a1a1a', letterSpacing: 0.4,
        }}>HP</span>
        <div style={{ display: 'flex', gap: 1.5, flex: 1 }}>
          {Array.from({ length: segs }, (_, i) => (
            <div key={i} style={{
              flex: 1, height: 11,
              background: i < filled ? barColor : 'rgba(60,60,67,0.10)',
              boxShadow: i < filled ? 'inset 0 -1px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.18)' : 'none',
              transition: 'background 300ms ease',
            }} />
          ))}
        </div>
        <span style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 11, fontWeight: 800,
          color: '#1a1a1a', minWidth: 38, textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}>{isDead ? '— —' : String(hp).padStart(3, '0')}/100</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CharacterChooser — modal that lets the user pick a character.
// Unlocked only at HP === 100 ("max bond, your pet evolves").
// Each card shows the pet sprite + label + blurb.
// ─────────────────────────────────────────────────────────────
function CharacterChooser({ open, onClose, current, onPick }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: open ? 'auto' : 'none',
      zIndex: 200,
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20,15,5,0.55)',
        opacity: open ? 1 : 0,
        transition: 'opacity 240ms ease',
        backdropFilter: 'blur(3px)',
      }} />
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 16, right: 16,
        top: '50%', transform: `translateY(${open ? '-50%' : 'calc(-50% + 18px)'})`,
        background: '#FAF7F0',
        borderRadius: 22,
        padding: '20px 18px',
        boxShadow: '0 24px 50px rgba(0,0,0,0.28)',
        opacity: open ? 1 : 0,
        transition: 'all 280ms cubic-bezier(.3,.7,.4,1)',
      }}>
        <div style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 10, fontWeight: 800, letterSpacing: 1.6,
          color: '#46A65A', textTransform: 'uppercase',
          marginBottom: 4,
        }}>◆ HP MAX · EVOLUTION UNLOCKED ◆</div>
        <div style={{
          fontSize: 22, fontWeight: 800, letterSpacing: -0.4,
          color: '#1a1a1a', marginBottom: 12,
        }}>Pick your pet</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['blip', 'buni', 'nova'].map((k) => {
            const def = CHARACTERS[k];
            const active = k === current;
            return (
              <button key={k} onClick={() => { onPick(k); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 12px',
                  background: active ? '#FFF6E0' : '#fff',
                  border: active ? '1.5px solid #46A65A' : '1px solid rgba(60,60,67,0.1)',
                  borderRadius: 14, cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: active ? '0 0 0 4px rgba(70,166,90,0.12)' : 'none',
                  transition: 'all 160ms ease',
                }}>
                {/* sprite preview */}
                <div style={{
                  width: 64, height: 64,
                  background: '#B0BD78',
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  <PetSprite character={k} state="thriving" cell={3} monochrome={true} inkColor="#1F2410" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 17, fontWeight: 700, letterSpacing: -0.2,
                    color: '#1a1a1a',
                  }}>{def.label}</div>
                  <div style={{
                    fontSize: 13, color: 'rgba(60,60,67,0.65)',
                    marginTop: 1,
                  }}>{def.blurb}</div>
                </div>
                {active && (
                  <div style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: 1,
                    color: '#46A65A', textTransform: 'uppercase',
                    flexShrink: 0,
                  }}>✓ Current</div>
                )}
              </button>
            );
          })}
        </div>

        <button onClick={onClose} style={{
          marginTop: 14, width: '100%',
          padding: '10px 0', borderRadius: 12,
          border: 0, background: '#1a1a1a', color: '#fff',
          fontSize: 14, fontWeight: 600,
          cursor: 'pointer',
        }}>Close</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  MOTIVATIONAL_MESSAGES, pickMessage,
  HeartsBurst, FoodBowl, MessageToast,
  HPHeader, CharacterChooser,
});
