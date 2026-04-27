import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Heart,
  HeartCrack,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  Crosshair,
} from 'lucide-react';

const loveLines = [
  "you are genuinely the only woman i want to spend the rest of my life with jaani.",
  "my heart beats so vigorously every single time i think of you baby.",
  "there is nothing comparable to your magnificent smile my beautoful girl.",
  "being away from you all this time has really shown me how badly i'm desperate for you.",
  "you make me the happiest barkha.",
  "i miss you my beautiful girl, i miss your face, your hair, your breath, everything.",
  "you are my home. wherever you are is where i want to be.",
];

/* ─── BACKGROUND LAYER ─── */
function BgLayer() {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 8 + Math.random() * 14,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * -20,
    })), []);

  return (
    <div className="bg-layer">
      <div className="bg-glow bg-glow--1" />
      <div className="bg-glow bg-glow--2" />
      <div className="bg-glow bg-glow--3" />
      <div className="bg-grid" />
      <div className="bg-scanlines" />
      {particles.map(p => (
        <div
          key={p.id}
          className="bg-particle"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <Heart size={p.size} fill="currentColor" />
        </div>
      ))}
      <div className="bg-vignette" />
    </div>
  );
}

/* ─── TITLE BAR ─── */
function TitleBar({ hits }) {
  return (
    <div className="title-bar">
      <span className="title-bar__name">Aim for My Heart</span>
      <span className="title-bar__counter">
        <span className="title-bar__counter-num">{hits}</span> / 7
      </span>
    </div>
  );
}

/* ─── SPEED BADGE ─── */
function SpeedBadge({ hits }) {
  const labels = ['Ready', 'Slow', 'Moving', 'Quick', 'Fast!', 'Blazing!', 'INSANE!', '!!!'];
  return (
    <div className="speed-badge">
      ⚡ {labels[hits] || '!!!'}
    </div>
  );
}

/* ─── BOUNCING HEART TARGET ─── */
function HeartTarget({ targetRef, pos, size, isHit }) {
  return (
    <div
      ref={targetRef}
      className={`heart-target ${isHit ? 'heart-target--hit' : ''}`}
      style={{
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        width: size,
        height: size,
      }}
    >
      <Heart
        size={size}
        fill="#C4426A"
        color="#8B2252"
        strokeWidth={1.5}
      />
    </div>
  );
}

/* ─── HIT MARKER (rings + score popup) ─── */
function HitMarker({ x, y, hitNum }) {
  return (
    <div className="hit-marker" style={{ left: x, top: y }}>
      <div className="hit-marker__ring" />
      <div className="hit-marker__ring hit-marker__ring--2" />
      <div className="hit-marker__ring hit-marker__ring--3" />
      <div className="hit-marker__score">💘 {hitNum}/7</div>
    </div>
  );
}

/* ─── MISS SPLAT ─── */
function MissSplat({ miss }) {
  return (
    <div
      className="miss-splat"
      style={{ left: miss.x - 10, top: miss.y - 10 }}
    >
      <HeartCrack size={20} />
    </div>
  );
}

/* ─── MESSAGE CARD ─── */
function MessageCard({ text, index, hits, justRevealed }) {
  const unlocked = index < hits;
  const revealing = justRevealed === index;

  return (
    <div className={`message-card ${unlocked ? 'message-card--revealed' : ''}`}>
      <span className="message-card__icon">
        {unlocked ? (
          <Unlock
            size={14}
            color="#C4426A"
            className={revealing ? 'message-card__icon--unlock' : ''}
          />
        ) : (
          <Lock size={14} color="#9B7B6E" />
        )}
      </span>
      <span
        className={`message-card__text ${!unlocked
          ? 'message-card__text--locked'
          : revealing
            ? 'message-card__text--revealing'
            : ''
          }`}
      >
        {text}
      </span>
    </div>
  );
}

/* ─── LOVE REVEAL PANEL ─── */
function LoveReveal({ hits, justRevealed }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current && hits > 0) {
      const cards = panelRef.current.children;
      if (cards[hits - 1]) {
        cards[hits - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [hits]);

  return (
    <div className="love-panel" ref={panelRef}>
      {loveLines.map((line, i) => (
        <MessageCard
          key={i}
          text={line}
          index={i}
          hits={hits}
          justRevealed={justRevealed}
        />
      ))}
    </div>
  );
}

/* ─── FINALE OVERLAY ─── */
function Finale({ onReplay }) {
  const burstAngles = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <div className="finale-overlay">
      <div className="finale__heart-burst">
        {burstAngles.map((angle, i) => (
          <div
            key={i}
            className="finale__burst-heart"
            style={{
              '--angle': `${angle}deg`,
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <Heart size={16} fill="#E8849E" color="#E8849E" />
          </div>
        ))}
      </div>

      <Sparkles size={32} className="finale__sparkle" />

      <h1 className="finale__heading">i love you so much baby</h1>
      <p className="finale__subheading">you're so good at this!</p>

      <div className="finale__messages">
        {loveLines.map((line, i) => (
          <p
            key={i}
            className="finale__msg"
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
          >
            "{line}"
          </p>
        ))}
      </div>

      <button
        className="finale__replay-btn"
        onPointerDown={onReplay}
      >
        <RefreshCw size={16} />
        Play Again
      </button>
    </div>
  );
}

/* ─── COMBO FLASH ─── */
function ComboFlash({ hits }) {
  if (hits === 0) return null;
  const labels = ['', '💕', '💖', '🔥', '⚡', '💘', '✨', '💗'];
  return (
    <div className="combo-display" key={hits}>
      {labels[hits] || '💗'}
    </div>
  );
}

/* ─══════ MAIN APP ══════─ */

function getRandomPos(canvasRect, padding = 50) {
  if (!canvasRect) return { x: 200, y: 300 };
  return {
    x: padding + Math.random() * (canvasRect.width - padding * 2),
    y: padding + Math.random() * (canvasRect.height - padding * 2),
  };
}

function getRandomVelocity(speed) {
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

export default function App() {
  const [hits, setHits] = useState(0);
  const [missHearts, setMiss] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [hintVisible, setHintVisible] = useState(true);
  const [justRevealed, setJustRevealed] = useState(-1);
  const [heartPos, setHeartPos] = useState({ x: 200, y: 250 });
  const [heartSize, setHeartSize] = useState(56);
  const [isHit, setIsHit] = useState(false);
  const [hitMarkers, setHitMarkers] = useState([]);
  const [showFlash, setShowFlash] = useState(false);
  const [comboKey, setComboKey] = useState(0);
  const [aimPos, setAimPos] = useState({ x: -100, y: -100 });

  const canvasRef = useRef(null);
  const targetRef = useRef(null);
  const posRef = useRef({ x: 200, y: 250 });
  const velRef = useRef({ vx: 1.5, vy: 1.2 });
  const speedRef = useRef(2.0);
  const hitsRef = useRef(0);
  const phaseRef = useRef('idle');
  const animRef = useRef(null);
  const pausedRef = useRef(false);

  /* ─── BASE SPEED: hand-tuned per level ─── */
  const getSpeed = useCallback((hitCount) => {
    // Manually tuned: fast ramp early, gentler on 5-6-7
    const speeds = [2.0, 3.0, 4.0, 5.2, 6.5, 7.0, 7.5, 8.0];
    return speeds[hitCount] ?? 8.0;
  }, []);

  /* ─── SPAWN HEART at random pos with new speed ─── */
  const spawnHeart = useCallback((hitCount, canvasEl) => {
    const rect = canvasEl?.getBoundingClientRect();
    const newPos = getRandomPos(rect);
    const newSpeed = getSpeed(hitCount);
    const newVel = getRandomVelocity(newSpeed);
    posRef.current = newPos;
    velRef.current = newVel;
    speedRef.current = newSpeed;
    setHeartPos(newPos);
    // Shrink slightly each level (min 36px)
    setHeartSize(Math.max(36, 56 - hitCount * 3));
    pausedRef.current = false;
  }, [getSpeed]);

  /* ─── ANIMATION LOOP: bounce heart around ─── */
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 16.67, 3); // cap delta
      lastTime = now;

      if (!pausedRef.current && phaseRef.current !== 'finale') {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const size = Math.max(36, 56 - hitsRef.current * 3);
          const halfSize = size / 2;
          let { x, y } = posRef.current;
          let { vx, vy } = velRef.current;

          x += vx * dt;
          y += vy * dt;

          // Bounce off walls
          if (x < halfSize) { x = halfSize; vx = Math.abs(vx); randomizeAngle(); }
          if (x > rect.width - halfSize) { x = rect.width - halfSize; vx = -Math.abs(vx); randomizeAngle(); }
          if (y < halfSize) { y = halfSize; vy = Math.abs(vy); randomizeAngle(); }
          if (y > rect.height - halfSize) { y = rect.height - halfSize; vy = -Math.abs(vy); randomizeAngle(); }

          function randomizeAngle() {
            // Add slight random angle perturbation on bounce
            const speed = speedRef.current;
            const currentAngle = Math.atan2(vy, vx);
            const jitter = (Math.random() - 0.5) * 0.8;
            vx = Math.cos(currentAngle + jitter) * speed;
            vy = Math.sin(currentAngle + jitter) * speed;
          }

          posRef.current = { x, y };
          velRef.current = { vx, vy };
          setHeartPos({ x, y });
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  /* ─── INITIAL SPAWN ─── */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        spawnHeart(0, canvasRef.current);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [spawnHeart]);

  /* ─── POINTER MOVE: crosshair ─── */
  const handlePointerMove = useCallback((e) => {
    if (phaseRef.current === 'finale') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setAimPos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  /* ─── POINTER DOWN: tap to hit ─── */
  const handlePointerDown = useCallback((e) => {
    if (phaseRef.current === 'finale' || pausedRef.current) return;

    if (hintVisible) setHintVisible(false);
    if (phaseRef.current === 'idle') {
      phaseRef.current = 'playing';
      setPhase('playing');
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;

    // Hit detection
    const { x: hx, y: hy } = posRef.current;
    const currentSize = Math.max(36, 56 - hitsRef.current * 3);
    const hitRadius = currentSize * 0.7; // generous hit zone
    const dist = Math.hypot(tapX - hx, tapY - hy);

    if (dist < hitRadius) {
      // ─── HIT! ───
      pausedRef.current = true;
      setIsHit(true);
      setShowFlash(true);

      const newHits = hitsRef.current + 1;
      hitsRef.current = newHits;
      setHits(newHits);
      setJustRevealed(newHits - 1);
      setComboKey(prev => prev + 1);

      // Hit marker at heart position
      setHitMarkers(prev => [
        ...prev,
        { id: Date.now(), x: hx, y: hy, num: newHits }
      ].slice(-5));

      setTimeout(() => setShowFlash(false), 300);

      if (newHits >= 7) {
        setTimeout(() => {
          phaseRef.current = 'finale';
          setPhase('finale');
        }, 900);
      } else {
        // Respawn after brief pause
        setTimeout(() => {
          setIsHit(false);
          spawnHeart(newHits, canvas);
        }, 700);
      }
    } else {
      // ─── MISS ───
      setMiss(prev =>
        [...prev, { id: Date.now(), x: tapX, y: tapY }].slice(-12)
      );
    }
  }, [hintVisible, spawnHeart]);

  /* ─── REPLAY ─── */
  const handleReplay = useCallback(() => {
    hitsRef.current = 0;
    phaseRef.current = 'idle';
    pausedRef.current = false;
    setHits(0);
    setMiss([]);
    setPhase('idle');
    setHintVisible(true);
    setJustRevealed(-1);
    setIsHit(false);
    setHitMarkers([]);
    setShowFlash(false);
    setComboKey(0);

    setTimeout(() => {
      if (canvasRef.current) {
        spawnHeart(0, canvasRef.current);
      }
    }, 100);
  }, [spawnHeart]);

  return (
    <>
      <div className={`game-screen ${phase === 'idle' ? 'game-screen--entering' : ''}`}>
        <BgLayer />
        <TitleBar hits={hits} />
        {phase === 'playing' && <SpeedBadge hits={hits} />}

        <div
          className="game-canvas"
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
        >
          {phase !== 'finale' && (
            <HeartTarget
              targetRef={targetRef}
              pos={heartPos}
              size={heartSize}
              isHit={isHit}
            />
          )}

          {hitMarkers.map(m => (
            <HitMarker key={m.id} x={m.x} y={m.y} hitNum={m.num} />
          ))}

          {missHearts.map(m => (
            <MissSplat key={m.id} miss={m} />
          ))}

          <Crosshair
            className="crosshair"
            size={28}
            style={{ left: aimPos.x - 14, top: aimPos.y - 14 }}
          />

          <div className={`hint-text ${!hintVisible ? 'hint-text--hidden' : ''}`}>
            tap the heart to shoot
          </div>

          <ComboFlash hits={comboKey} key={comboKey} />
        </div>

        <LoveReveal hits={hits} justRevealed={justRevealed} />
      </div>

      {showFlash && <div className="screen-flash" />}
      {phase === 'finale' && <Finale onReplay={handleReplay} />}
    </>
  );
}
