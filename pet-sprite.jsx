// pet-sprite.jsx — Three pixel-pet characters (Blip, Buni, Nova)
// Each character has 4 sprite templates: normal / worried / sick / dead.
// Each template is an array of 2 animation frames (18×18 char grids).
//
// Encoding (kept compatible with the device's monochrome renderer):
//   '.' transparent, 'B' body, 'E' eye (cut out to LCD bg in monochrome),
//   'M' mouth (cut out), 'X' accent (ink), 'D' darker shadow (ink).
//
// In monochrome mode (the LCD), B/D/X all render as ink and E/M cut out
// to the LCD background. So the visual effect is "dark silhouette with
// negative-space eyes and mouth" — classic LCD virtual-pet look.

const CHARACTERS = {
  // ── Blip — a tall dome / jellyfish-skull shape ────────────────
  blip: {
    label: 'Blip',
    blurb: 'A bouncy little dome of curiosity.',
    palette: { B: '#7BD389', D: '#46A65A', E: '#1F1A1A', M: '#D85A30', C: '#FF9FB0', X: '#FFE066' },
    normal: [
      [
        '..................',
        '.......BBBB.......',
        '......BBBBBB......',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '.BBBBBBBBBBBBBBBB.',
        '.BBEEBBBBBBBBEEBB.',
        '.BBEEBBBBBBBBEEBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBMMMMBBBBBB.',
        '.BBBBBBMMMMBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBB...BBBB...BBB.',
        '.BB.....BB.....BB.',
        '..................',
      ],
      [
        '..................',
        '.......BBBB.......',
        '......BBBBBB......',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '.BBBBBBBBBBBBBBBB.',
        '.BBEEBBBBBBBBEEBB.',
        '.BBEEBBBBBBBBEEBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBMMMMBBBBBB.',
        '.BBBBBBMMMMBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BB...BBBBBB...BB.',
        '.B.....BBBB.....B.',
        '..................',
      ],
    ],
    worried: [
      [
        '..................',
        '.......BBBB.......',
        '......BBBBBB......',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '.BBBBBBBBBBBBBBBB.',
        '.BEEEEBBBBBBEEEEB.',
        '.BEEEEBBBBBBEEEEB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBMMMMBBBBBB.',
        '.BBBBBMBBBBMBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBB...BBBB...BBB.',
        '.BB.....BB.....BB.',
        '..................',
      ],
      [
        '..................',
        '.......BBBB.......',
        '......BBBBBB......',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '.BBBBBBBBBBBBBBBB.',
        '.BEEEEBBBBBBEEEEB.',
        '.BEEEEBBBBBBEEEEB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBMMMMBBBBBB.',
        '.BBBBBMBBBBMBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '.BB...BBBBBB...BB.',
        '.B.....BBBB.....B.',
        '..................',
      ],
    ],
    sick: [
      [
        '..................',
        '..................',
        '..................',
        '..................',
        '..................',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '..BBMMBBBBBBEEBB..',
        '..BMEEMBBBBBEEBB..',
        '..BBMMBBBBBBBBBB..',
        '..BBBBBBBBBBBBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBBBBBBBBB....',
        '..................',
        '..................',
        '..................',
      ],
      [
        '..................',
        '..................',
        '..................',
        '..................',
        '..................',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '..BMMMBBBBBBEEBB..',
        '..BMEEMBBBBBEEBB..',
        '..BMMMBBBBBBBBBB..',
        '..BBBBBBBBBBBBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBBBBBBBBB....',
        '..................',
        '..................',
        '..................',
      ],
    ],
    dead: [
      [
        '......XXXXXX......',
        '.....XX....XX.....',
        '......XXXXXX......',
        '.......BBBB.......',
        '......BBBBBB......',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBEBEBBBBEBEBB..',
        '..BBBEBBBBBBEBBB..',
        '..BBEBEBBBBEBEBB..',
        '..BBBBBBBBBBBBBB..',
        '..BBBBBBMMMMBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBBBBBBBBB....',
        '....DBDBDBDBDBD...',
        '.....D.D.D.D.D....',
        '..................',
      ],
      [
        '.....XXXXXXXX.....',
        '....XX......XX....',
        '.....XXXXXXXX.....',
        '..................',
        '.......BBBB.......',
        '......BBBBBB......',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBEBEBBBBEBE...',
        '...BBBEBBBBBBEB...',
        '...BBEBEBBBBEBE...',
        '...BBBBBBBBBBBB...',
        '...BBBBMMMMBBBB...',
        '....BBBBBBBBBB....',
        '.....BBBBBBBB.....',
        '.....DBDBDBDB.....',
        '......D.D.D.D.....',
        '..................',
      ],
    ],
  },

  // ── Buni — long-eared bunny ────────────────────────────────────
  buni: {
    label: 'Buni',
    blurb: 'Twitchy ears, soft heart.',
    palette: { B: '#FFD86B', D: '#D9A82E', E: '#1F1A1A', M: '#8C5A1F', C: '#FFB39B', X: '#FFF' },
    normal: [
      [
        '..................',
        '....BB......BB....',
        '....BB......BB....',
        '....BB......BB....',
        '....BB......BB....',
        '....BBB....BBB....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '..BBEEBBBBBBEEBB..',
        '..BBEEBBBBBBEEBB..',
        '..BBBBBBBBBBBBBB..',
        '..BBBBBBMMBBBBBB..',
        '..BBBBBMMMMBBBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBB....BBB....',
        '..................',
      ],
      [
        '..................',
        '....BB......BB....',
        '....BB......BB....',
        '....BB......BB....',
        '....BB......BB....',
        '....BBB....BBB....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '..BBEEBBBBBBEEBB..',
        '..BBEEBBBBBBEEBB..',
        '..BBBBBBBBBBBBBB..',
        '..BBBBBBMMBBBBBB..',
        '..BBBBMMMMMMBBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BB......BB....',
        '...BBB......BBB...',
      ],
    ],
    worried: [
      [
        '..................',
        '....BB......BB....',
        '....BB......BB....',
        '....BB......BB....',
        '...BB........BB...',
        '...BBB......BBB...',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '..BEEEEBBBBEEEEB..',
        '..BEEEEBBBBEEEEB..',
        '..BBBBBBBBBBBBBB..',
        '..BBBBMMMMMMBBBB..',
        '..BBBMBBBBBBMBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBB....BBB....',
        '..................',
      ],
      [
        '..................',
        '....BB......BB....',
        '....BB......BB....',
        '....BB......BB....',
        '...BB........BB...',
        '...BBB......BBB...',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '..BEEEEBBBBEEEEB..',
        '..BEEEEBBBBEEEEB..',
        '..BBBBBBBBBBBBBB..',
        '..BBBBMMMMMMBBBB..',
        '..BBBMBBBBBBMBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BB......BB....',
        '...BBB......BBB...',
      ],
    ],
    sick: [
      [
        '..................',
        '..................',
        '..................',
        '...BB.............',
        '...BB.............',
        '...BBB............',
        '...BBBBBBBBB......',
        '..BBBBBBBBBBB.....',
        '..BBBBBBBBBBBB....',
        '..BBMMBBBBBEEBB...',
        '..BMEEMBBBBEEBB...',
        '..BBMMBBBBBBBBB...',
        '..BBBBBBBBBBBBB...',
        '..BBBBBBBBBBBB....',
        '...BBBBBBBBBB.....',
        '..................',
        '..................',
        '..................',
      ],
      [
        '..................',
        '..................',
        '..................',
        '...BB.............',
        '...BB.............',
        '...BBB............',
        '...BBBBBBBBB......',
        '..BBBBBBBBBBB.....',
        '..BBBBBBBBBBBB....',
        '..BMMMBBBBBEEBB...',
        '..BMEEMBBBBEEBB...',
        '..BMMMBBBBBBBBB...',
        '..BBBBBBBBBBBBB...',
        '..BBBBBBBBBBBB....',
        '...BBBBBBBBBB.....',
        '..................',
        '..................',
        '..................',
      ],
    ],
    dead: [
      [
        '......XXXXXX......',
        '.....XX....XX.....',
        '......XXXXXX......',
        '....BB......BB....',
        '....BB......BB....',
        '....BBB....BBB....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '..BBEBEBBBBEBEBB..',
        '..BBBEBBBBBBEBBB..',
        '..BBEBEBBBBEBEBB..',
        '..BBBBBBMMBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBBBBBBBBB....',
        '....DBDBDBDBDBD...',
        '.....D.D.D.D.D....',
        '..................',
      ],
      [
        '.....XXXXXXXX.....',
        '....XX......XX....',
        '.....XXXXXXXX.....',
        '....BB......BB....',
        '....BB......BB....',
        '....BBB....BBB....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBEBEBBBBEBEBB..',
        '..BBBEBBBBBBEBBB..',
        '..BBEBEBBBBEBEBB..',
        '..BBBBBBMMBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBBBBBBBBB....',
        '.....BBBBBBBB.....',
        '....DBDBDBDBDB....',
        '.....D.D.D.D.D....',
        '..................',
      ],
    ],
  },

  // ── Nova — antennaed alien with side wings ────────────────────
  nova: {
    label: 'Nova',
    blurb: 'Antennae attuned to good vibes.',
    palette: { B: '#C9B3D9', D: '#8472A0', E: '#1F1A1A', M: '#5A3A6A', C: '#FF9FB0', X: '#FFE066' },
    normal: [
      [
        '..................',
        '....B.......B.....',
        '....B.......B.....',
        '....BB.....BB.....',
        '....BBB...BBB.....',
        '.....BB...BB......',
        '...BBBBBBBBBBB....',
        '..BBBBBBBBBBBBB...',
        '.BBBBBBBBBBBBBBB..',
        'BBBEEBBBBBBBEEBBB.',
        'BBBEEBBBBBBBEEBBB.',
        'BBBBBBBBBBBBBBBBB.',
        '.BBBBBBMMBBBBBBB..',
        '.BBBBBBMMBBBBBBB..',
        '..BBBBBBBBBBBBB...',
        '..BBBBBBBBBBBBB...',
        '...BBB....BBB.....',
        '..................',
      ],
      [
        '....B.......B.....',
        '....B.......B.....',
        '....BB.....BB.....',
        '....BBB...BBB.....',
        '.....BB...BB......',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '.BBBBBBBBBBBBBBB..',
        'BBBEEBBBBBBBEEBBB.',
        'BBBEEBBBBBBBEEBBB.',
        'BBBBBBBBBBBBBBBBB.',
        '.BBBBBBMMBBBBBBB..',
        '.BBBBBBMMBBBBBBB..',
        '..BBBBBBBBBBBBB...',
        '...BBBBBBBBBBB....',
        '....BBB....BBB....',
        '..................',
      ],
    ],
    worried: [
      [
        '..................',
        '....B.......B.....',
        '....B.......B.....',
        '....BB.....BB.....',
        '...BBB.....BBB....',
        '...BB.......BB....',
        '...BBBBBBBBBBB....',
        '..BBBBBBBBBBBBB...',
        '.BBBBBBBBBBBBBBB..',
        'BBEEEEBBBBBEEEEBB.',
        'BBEEEEBBBBBEEEEBB.',
        'BBBBBBBBBBBBBBBBB.',
        '.BBBBMMMMMMMBBBB..',
        '.BBBMBBBBBBBMBBB..',
        '..BBBBBBBBBBBBB...',
        '..BBBBBBBBBBBBB...',
        '...BBB....BBB.....',
        '..................',
      ],
      [
        '..................',
        '....B.......B.....',
        '....B.......B.....',
        '....BB.....BB.....',
        '...BBB.....BBB....',
        '...BB.......BB....',
        '...BBBBBBBBBBB....',
        '..BBBBBBBBBBBBB...',
        '.BBBBBBBBBBBBBBB..',
        'BBEEEEBBBBBEEEEBB.',
        'BBEEEEBBBBBEEEEBB.',
        'BBBBBBBBBBBBBBBBB.',
        '.BBBBMMMMMMMBBBB..',
        '.BBBMBBBBBBBMBBB..',
        '..BBBBBBBBBBBBB...',
        '..BBBBBBBBBBBBB...',
        '...BB......BB.....',
        '..................',
      ],
    ],
    sick: [
      [
        '..................',
        '..................',
        '..................',
        '..................',
        '..................',
        '....B........B....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '.BBBBBBBBBBBBBBBB.',
        '.BBMMBBBBBBBBEEBB.',
        '.BMEEMBBBBBBBEEBB.',
        '.BBMMBBBBBBBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '..................',
        '..................',
        '..................',
      ],
      [
        '..................',
        '..................',
        '..................',
        '..................',
        '..................',
        '....B........B....',
        '...BBBBBBBBBBBB...',
        '..BBBBBBBBBBBBBB..',
        '.BBBBBBBBBBBBBBBB.',
        '.BMMMBBBBBBBBEEBB.',
        '.BMEEMBBBBBBBEEBB.',
        '.BMMMBBBBBBBBBBBB.',
        '.BBBBBBBBBBBBBBBB.',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '..................',
        '..................',
        '..................',
      ],
    ],
    dead: [
      [
        '......XXXXXX......',
        '.....XX....XX.....',
        '......XXXXXX......',
        '....B.......B.....',
        '....BB.....BB.....',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBEBEBBBBEBEBB..',
        '..BBBEBBBBBBEBBB..',
        '..BBEBEBBBBEBEBB..',
        '..BBBBBBMMBBBBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBBBBBBBBB....',
        '....DBDBDBDBDBD...',
        '.....D.D.D.D.D....',
        '..................',
      ],
      [
        '.....XXXXXXXX.....',
        '....XX......XX....',
        '.....XXXXXXXX.....',
        '....B.......B.....',
        '....BB.....BB.....',
        '.....BBBBBBBB.....',
        '....BBBBBBBBBB....',
        '...BBBBBBBBBBBB...',
        '..BBEBEBBBBEBEBB..',
        '..BBBEBBBBBBEBBB..',
        '..BBEBEBBBBEBEBB..',
        '..BBBBBBMMBBBBBB..',
        '..BBBBBBBBBBBBBB..',
        '...BBBBBBBBBBBB...',
        '....BBBBBBBBBB....',
        '.....DBDBDBDB.....',
        '......D.D.D.D.....',
        '..................',
      ],
    ],
  },
};

// State → which template + animation timing
const STATE_TO_TEMPLATE = {
  thriving: { tmpl: 'normal',  interval: 600 },
  happy:    { tmpl: 'normal',  interval: 800 },
  neutral:  { tmpl: 'normal',  interval: 1200 },
  anxious:  { tmpl: 'worried', interval: 200 },
  sick:     { tmpl: 'sick',    interval: 1200 },
  dead:     { tmpl: 'dead',    interval: 1400 },
};

function PetSprite({ character = 'blip', state = 'happy', cell = 7, animate = true, monochrome = true, inkColor = '#1F2410' }) {
  const [frame, setFrame] = React.useState(0);
  const [displayState, setDisplayState] = React.useState(state);
  const [opacity, setOpacity] = React.useState(1);

  // Cross-fade on state change
  React.useEffect(() => {
    if (state === displayState) return;
    setOpacity(0);
    const t = setTimeout(() => {
      setDisplayState(state);
      setOpacity(1);
    }, 240);
    return () => clearTimeout(t);
  }, [state, displayState]);

  // Animation cadence per state
  React.useEffect(() => {
    if (!animate) return;
    const { interval } = STATE_TO_TEMPLATE[displayState] || STATE_TO_TEMPLATE.happy;
    const id = setInterval(() => setFrame(f => 1 - f), interval);
    return () => clearInterval(id);
  }, [animate, displayState]);

  const char = CHARACTERS[character] || CHARACTERS.blip;
  const tmplKey = (STATE_TO_TEMPLATE[displayState] || STATE_TO_TEMPLATE.happy).tmpl;
  const frames = char[tmplKey] || char.normal;
  const sprite = frames[frame % frames.length];
  const W = sprite[0].length, H = sprite.length;

  // Idle motion: bob amplitude by state
  const bobAmp =
    displayState === 'thriving' ? 6 :
    displayState === 'happy'    ? 3 :
    displayState === 'neutral'  ? 1 :
    displayState === 'dead'     ? 8 : 0;

  return (
    <div style={{
      position: 'relative',
      width: W * cell, height: H * cell,
      opacity, transition: 'opacity 240ms ease',
      animation: bobAmp > 0
        ? `petBob${displayState} ${displayState === 'thriving' ? 0.9 : displayState === 'dead' ? 2.4 : 1.6}s ease-in-out infinite`
        : displayState === 'anxious'
          ? 'petTremble 90ms linear infinite'
          : 'none',
      imageRendering: 'pixelated',
    }}>
      <style>{`
        @keyframes petBobthriving { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-${bobAmp}px); } }
        @keyframes petBobhappy    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-${bobAmp}px); } }
        @keyframes petBobneutral  { 0%,100% { transform: scaleY(1); }    50% { transform: scaleY(0.98); } }
        @keyframes petBobdead     { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-${bobAmp}px); } }
        @keyframes petTremble     { 0%,100% { transform: translateX(-1px); } 50% { transform: translateX(1px); } }
      `}</style>
      {sprite.map((row, y) => (
        <div key={y} style={{ display: 'flex', height: cell }}>
          {row.split('').map((ch, x) => {
            let bg;
            if (ch === '.') bg = 'transparent';
            else if (monochrome) {
              bg = (ch === 'E' || ch === 'M') ? 'transparent' : inkColor;
            } else {
              bg = char.palette[ch] || 'transparent';
            }
            return <div key={x} style={{ width: cell, height: cell, background: bg }} />;
          })}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { CHARACTERS, PetSprite });
