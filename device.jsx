// device.jsx — Original handheld virtual-pet device shell
// (egg-shaped plastic, brass bezel, olive LCD, pastel buttons)

// ─────────────────────────────────────────────────────────────
// Device colorways — pastel plastic shells.
// Bezel + LCD + buttons stay fixed across colorways so the device
// always feels like the same toy in different finishes.
// ─────────────────────────────────────────────────────────────
const DEVICE_PALETTES = {
  butter: { body: '#F0D582', bodyDark: '#C09938', bodyHi: '#FBECBA' },
  mint:   { body: '#B6DFC5', bodyDark: '#74B493', bodyHi: '#DDF1E4' },
  coral:  { body: '#F2A593', bodyDark: '#BE634F', bodyHi: '#FAD0C5' },
  sky:    { body: '#A6C6E4', bodyDark: '#5B8DB7', bodyHi: '#CDDEEF' },
  ube:    { body: '#C9B3D9', bodyDark: '#8472A0', bodyHi: '#E0D2EB' },
};

const BEZEL = '#B79350';
const BEZEL_DARK = '#8B6C32';
const BEZEL_LIGHT = '#D7B770';
const LCD_BG = '#B0BD78';     // olive lcd
const LCD_BG_DK = '#94A35F';
const LCD_INK = '#1F2410';    // dark olive sprite / text color
const LCD_INK_DIM = '#5C6336';

// ─────────────────────────────────────────────────────────────
// Egg-shaped plastic shell with tiny eyelet at the top.
// ─────────────────────────────────────────────────────────────
function DeviceShell({ children, palette }) {
  const { body, bodyDark, bodyHi } = palette;
  return (
    <div style={{
      position: 'relative',
      width: 318, height: 396,
      borderRadius: '42% 42% 50% 50% / 56% 56% 44% 44%',
      background: `radial-gradient(ellipse at 30% 22%, ${bodyHi} 0%, ${body} 42%, ${bodyDark} 100%)`,
      boxShadow:
        '0 36px 60px -22px rgba(40,25,5,0.30),' +
        '0 8px 18px rgba(40,25,5,0.10),' +
        'inset 0 -28px 44px rgba(0,0,0,0.10),' +
        'inset 0 14px 22px rgba(255,255,255,0.55)',
      transition: 'background 400ms ease',
    }}>
      {/* primary highlight */}
      <div style={{
        position: 'absolute', top: '8%', left: '14%',
        width: '32%', height: '18%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.85), transparent 70%)',
        pointerEvents: 'none', filter: 'blur(2px)',
      }} />
      {/* small dot highlight */}
      <div style={{
        position: 'absolute', top: '14%', left: '58%',
        width: '7%', height: '4%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.7)', filter: 'blur(1.5px)',
        pointerEvents: 'none',
      }} />
      {/* speckle texture */}
      <svg width="100%" height="100%" style={{
        position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
        borderRadius: 'inherit',
      }}>
        <defs>
          <pattern id="shellSpeckle" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="6" r="0.7" fill="#000" />
            <circle cx="14" cy="11" r="0.5" fill="#000" />
            <circle cx="9" cy="3" r="0.4" fill="#000" />
            <circle cx="18" cy="17" r="0.6" fill="#000" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#shellSpeckle)" />
      </svg>
      {/* eyelet at top */}
      <div style={{
        position: 'absolute', top: -6, left: '50%',
        transform: 'translateX(-50%)',
        width: 14, height: 14, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #444 0%, #111 60%, #000 100%)',
        boxShadow:
          '0 2px 3px rgba(0,0,0,0.35),' +
          'inset 0 1px 0 rgba(255,255,255,0.15)',
      }} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pixel-text header above the LCD: "◆ TASKEGG ◆"  +  "LV.NN · POCKET PAL"
// ─────────────────────────────────────────────────────────────
function DeviceHeader({ title = 'TASKEGG', level = 3, subtitle = 'POCKET PAL' }) {
  return (
    <div style={{
      position: 'absolute', top: 14, left: 0, right: 0,
      textAlign: 'center',
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      pointerEvents: 'none',
    }}>
      <div style={{
        fontSize: 13, fontWeight: 800, letterSpacing: 2.2,
        color: '#6A4A1C',
      }}>◆ {title} ◆</div>
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 1.8,
        color: 'rgba(106,74,28,0.65)',
        marginTop: 1,
      }}>LV.{String(level).padStart(2, '0')} · {subtitle}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tiny pixel glyphs drawn from compact 8×8 grids. Black-on-LCD.
// ─────────────────────────────────────────────────────────────
const GLYPHS = {
  heart: [
    '.##.##.', '#######', '#######', '.#####.', '..###..', '...#...',
  ],
  bolt: [
    '..###..', '.##....', '.####..', '..##...', '....##.', '....#..',
  ],
  bowl: [
    '#######', '..###..', '#######', '##...##', '##...##', '.#####.',
  ],
  flag: [
    '#......', '#####..', '#####..', '#......', '#......', '#......',
  ],
  check: [
    '......#', '.....#.', '....#..', '#..#...', '##.#...', '.##....', '..#....',
  ],
  pie: [
    '..###..', '.#####.', '#.####.', '##.###.', '######.', '.####..', '..#....',
  ],
  dot: [
    '.###.', '#####', '#####', '#####', '.###.',
  ],
  zzz: [
    '###....', '..#....', '.#.###.', '#....#.', '###.#..', '...#...',
  ],
};

function PixelGlyph({ name, color = LCD_INK, scale = 2 }) {
  const g = GLYPHS[name];
  if (!g) return null;
  const w = g[0].length, h = g.length;
  return (
    <div style={{
      display: 'inline-grid',
      gridTemplateRows: `repeat(${h}, ${scale}px)`,
      gridTemplateColumns: `repeat(${w}, ${scale}px)`,
      imageRendering: 'pixelated',
    }}>
      {g.flatMap((row, y) => row.split('').map((c, x) => (
        <div key={`${y}-${x}`} style={{
          width: scale, height: scale,
          background: c === '#' ? color : 'transparent',
        }} />
      )))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Multi-stat segment bars at the bottom of the LCD (HP / EN / FC)
// ─────────────────────────────────────────────────────────────
function SegmentBar({ label, value, segs = 10, color = LCD_INK }) {
  const filled = Math.round((value / 100) * segs);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 3,
    }}>
      <span style={{
        fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
        color, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      }}>{label}</span>
      <div style={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: segs }, (_, i) => (
          <div key={i} style={{
            width: 5, height: 8,
            background: i < filled ? color : 'transparent',
            border: `1px solid ${color}`,
            boxSizing: 'border-box',
            transition: 'background 200ms ease',
          }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LCD screen — brass bezel + olive panel + scanlines.
// Lays out: top status row, pet stage, bottom action row, bars.
// ─────────────────────────────────────────────────────────────
function LCDScreen({ children }) {
  return (
    <div style={{
      position: 'absolute',
      top: 56, left: '50%', transform: 'translateX(-50%)',
      width: 230, height: 230,
      padding: 10,
      borderRadius: 14,
      // brass bezel
      background:
        `linear-gradient(180deg, ${BEZEL_LIGHT} 0%, ${BEZEL} 45%, ${BEZEL_DARK} 100%)`,
      boxShadow:
        '0 4px 0 ' + BEZEL_DARK + ',' +
        '0 10px 20px rgba(0,0,0,0.18),' +
        'inset 0 1px 0 rgba(255,255,255,0.5),' +
        'inset 0 -2px 4px rgba(0,0,0,0.2)',
    }}>
      {/* LCD panel */}
      <div style={{
        position: 'relative',
        width: '100%', height: '100%',
        borderRadius: 4,
        background: `linear-gradient(180deg, ${LCD_BG} 0%, ${LCD_BG_DK} 100%)`,
        boxShadow:
          'inset 0 3px 6px rgba(0,0,0,0.22),' +
          'inset 0 -1px 2px rgba(255,255,255,0.18)',
        overflow: 'hidden',
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      }}>
        {/* scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
          opacity: 0.6,
        }} />
        {/* corner gleam */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)',
          pointerEvents: 'none',
        }} />
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Status row at the TOP of the LCD: 4 little glyph icons
// ─────────────────────────────────────────────────────────────
function LCDTopRow({ overdueCount }) {
  return (
    <div style={{
      position: 'absolute', top: 6, left: 8, right: 8,
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ position: 'relative' }}>
        <PixelGlyph name="heart" />
        {overdueCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -8,
            fontSize: 8, fontWeight: 800,
            color: LCD_INK,
          }}>{overdueCount}</span>
        )}
      </div>
      <PixelGlyph name="bolt" />
      <PixelGlyph name="bowl" />
      <PixelGlyph name="flag" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Action row at the BOTTOM-MIDDLE of the LCD: check / pie / dot
// ─────────────────────────────────────────────────────────────
function LCDActionRow({ selected, onSelect }) {
  const items = [
    { id: 'check', glyph: 'check', tooltip: 'mark done' },
    { id: 'pie',   glyph: 'pie',   tooltip: 'plan' },
    { id: 'dot',   glyph: 'dot',   tooltip: 'focus' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 32,
      display: 'flex', justifyContent: 'space-around',
      alignItems: 'center', padding: '0 14px',
    }}>
      {items.map(it => {
        const active = it.id === selected;
        return (
          <button key={it.id} onClick={() => onSelect?.(it.id)} style={{
            background: 'transparent', border: 0, padding: 4,
            cursor: 'pointer',
            opacity: active ? 1 : 0.45,
            transition: 'opacity 200ms',
            position: 'relative',
          }}>
            <PixelGlyph name={it.glyph} />
            {active && (
              <div style={{
                position: 'absolute', left: 4, right: 4, bottom: 0,
                height: 1, background: LCD_INK,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HP / EN / FC bars docked to the bottom of the LCD
// ─────────────────────────────────────────────────────────────
function LCDStatBars({ hp, en, fc }) {
  return (
    <div style={{
      position: 'absolute', left: 8, right: 8, bottom: 6,
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: 4,
    }}>
      <SegmentBar label="HP" value={hp} segs={11} />
      <SegmentBar label="EN" value={en} segs={9} />
      <SegmentBar label="FC" value={fc} segs={5} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pet platform — short LCD-ink shadow for the creature
// ─────────────────────────────────────────────────────────────
function PetPlatform({ state }) {
  return (
    <div style={{
      width: 70, height: 4, borderRadius: '50%',
      background: 'radial-gradient(ellipse, ' + LCD_INK + ', transparent 70%)',
      opacity: state === 'dead' ? 0.2 : 0.5,
      transition: 'opacity 300ms',
    }} />
  );
}

// ─────────────────────────────────────────────────────────────
// Revival progress chip (only when dead)
// ─────────────────────────────────────────────────────────────
function RevivalChip({ revival }) {
  return (
    <div style={{
      position: 'absolute', top: 38, left: '50%',
      transform: 'translateX(-50%)',
      padding: '3px 8px',
      background: LCD_INK,
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
      color: LCD_BG, textTransform: 'uppercase',
    }}>
      Revive {revival}/3
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Three pastel labeled buttons below the LCD. Colors are fixed
// across colorways (pink/teal/lavender) so they pop.
// ─────────────────────────────────────────────────────────────
function DeviceButtons({ onA, onB, onC }) {
  const buttons = [
    { id: 'a', label: 'A', sub: 'add',  color: '#F4A9B8', dark: '#C16678' },
    { id: 'b', label: 'B', sub: 'feed', color: '#86CFC0', dark: '#4D9F8E' },
    { id: 'c', label: 'C', sub: 'form', color: '#B6A8E6', dark: '#7D6FB8' },
  ];
  const [pressed, setPressed] = React.useState(null);
  const handlers = { a: onA, b: onB, c: onC };
  return (
    <div style={{
      position: 'absolute', bottom: 30, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', gap: 30,
      pointerEvents: 'auto',
    }}>
      {buttons.map(b => {
        const isPressed = pressed === b.id;
        return (
          <div key={b.id} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 6,
          }}>
            <button
              onPointerDown={() => setPressed(b.id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              onClick={handlers[b.id]}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                border: 0, padding: 0, cursor: 'pointer',
                background: `radial-gradient(circle at 30% 25%, color-mix(in oklab, ${b.color}, #fff 35%) 0%, ${b.color} 50%, ${b.dark} 100%)`,
                boxShadow: isPressed
                  ? 'inset 0 3px 5px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.3)'
                  : `0 3px 0 ${b.dark}, 0 5px 10px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.5)`,
                transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
                transition: 'transform 80ms ease, box-shadow 80ms ease',
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 16, fontWeight: 800,
                color: 'rgba(255,255,255,0.95)',
                textShadow: '0 1px 1px rgba(0,0,0,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >{b.label}</button>
            <span style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              color: 'rgba(60,40,10,0.45)',
            }}>{b.sub}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  DEVICE_PALETTES, DeviceShell, DeviceHeader, LCDScreen, LCDTopRow,
  LCDActionRow, LCDStatBars, PetPlatform, RevivalChip, DeviceButtons,
  LCD_INK, LCD_BG, PixelGlyph,
});
