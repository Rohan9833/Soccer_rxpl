import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Football } from "./Artwork";
import {
  Zap,
  Goal,
  Upload,
  Footprints,
  MoveRight,
  Flag,
  Trophy,
} from "lucide-react";

const ZONES = ["Defense", "Midfield", "Attack"];

// Player poses cut out from the official Sales Soccer artwork.
// Opponents use the same poses recoloured to a purple-blue kit.
const FRAMES = ["run1", "run2", "run3", "shoot"];
const OPP_FRAMES = ["run1", "run2", "run3", "stand"];
// Source heights (px) keep every pose at the same real-world scale
const POSE_H = { run1: 261, run2: 248, run3: 243, shoot: 237, stand: 273 };
const poseHeight = (f) => `${(POSE_H[f] / POSE_H.stand) * 100}%`;
const playerSrc = (f) =>
  `${import.meta.env.BASE_URL}assets/visuals/players/player-${f}.png`;
const oppSrc = (f) =>
  `${import.meta.env.BASE_URL}assets/visuals/players/opponent-${f}.png`;

// Timeline (ms) for one loop: dribble past two defenders, then score
const T = {
  loop: 8800,
  runStart: 400,
  runEnd: 5800,
  kick: 5950,
  ballIn: 6450,
  goalEnd: 7700,
  fadeEnd: 8300,
};
const X = { start: 6, end: 79, goal: 96.4 }; // % of pitch width
const FEET = 58; // % from top where the players' feet sit (just below the halfway line)

// Two defenders. `dodge` is how far (in % of height) our player swerves to beat them.
const DEFENDERS = [
  { x: 35, y: 52, dodge: 10 }, // player goes round the outside (in front)
  { x: 60, y: 63, dodge: -11 }, // player cuts inside (behind)
];
const DODGE_W = 10; // half-width of each swerve, in % of width

const bell = (x, c, w) =>
  Math.abs(x - c) < w ? (1 + Math.cos((Math.PI * (x - c)) / w)) / 2 : 0;
const laneY = (x) =>
  DEFENDERS.reduce((y, d) => y + d.dodge * bell(x, d.x, DODGE_W), FEET);

const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function BallIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full drop-shadow-[0_3px_4px_rgba(0,0,0,0.6)]"
      aria-hidden="true"
    >
      <Football cx={50} cy={50} r={47} id="pitch-ball" />
    </svg>
  );
}

/* Goal drawn in perspective on the attacking goal line.
   Coordinates are % of the pitch stage (x of width, y of height), measured against the
   six-yard box so the goal mouth sits exactly on the goal line. */
const pt = (p) => `${p[0]},${p[1]}`;
const lerpP = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

function mesh(a, b, c, d, nu, nv) {
  // a-b-c-d quad (a->b along u, a->d along v); returns line segments
  const lines = [];
  for (let i = 1; i < nu; i += 1)
    lines.push([lerpP(a, b, i / nu), lerpP(d, c, i / nu)]);
  for (let j = 1; j < nv; j += 1)
    lines.push([lerpP(a, d, j / nv), lerpP(b, c, j / nv)]);
  return lines;
}

function GoalFrame({ gx, yMid, mouth, height, depth, post = 3.6, className }) {
  const N = [gx + 0.45, yMid + mouth / 2]; // near post base
  const F = [gx - 0.45, yMid - mouth / 2]; // far post base
  const Nt = [N[0], N[1] - height];
  const Ft = [F[0], F[1] - height * 0.9];
  const Nb = [N[0] + depth, N[1] + 0.6]; // back, on the ground
  const Fb = [F[0] + depth * 0.9, F[1] - 0.4];
  const Nbt = [N[0] + depth * 0.55, N[1] - height * 0.78]; // back of the roof
  const Fbt = [F[0] + depth * 0.5, F[1] - height * 0.72];

  const panels = [
    [Fb, Nb, Nbt, Fbt], // back net
    [F, Fb, Fbt, Ft], // far side net
    [Ft, Fbt, Nbt, Nt], // roof
    [N, Nb, Nbt, Nt], // near side net
  ];
  const netLines = [
    ...mesh(Fb, Nb, Nbt, Fbt, 7, 5),
    ...mesh(F, Fb, Fbt, Ft, 3, 6),
    ...mesh(Ft, Nt, Nbt, Fbt, 7, 2),
    ...mesh(N, Nb, Nbt, Nt, 3, 6),
  ];
  const ns = { vectorEffect: "non-scaling-stroke" };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
    >
      {/* shadow */}
      <polygon
        points={[N, F, Fb, Nb].map(pt).join(" ")}
        fill="rgba(0,0,0,0.35)"
      />
      {panels.map((q, i) => (
        <polygon
          key={i}
          points={q.map(pt).join(" ")}
          fill="rgba(255,255,255,0.08)"
        />
      ))}
      <g stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" {...ns}>
        {netLines.map(([a, b], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} {...ns} />
        ))}
      </g>
      {/* back frame */}
      <g
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      >
        <polyline points={[Nt, Nbt, Nb].map(pt).join(" ")} {...ns} />
        <polyline points={[Ft, Fbt, Fb].map(pt).join(" ")} {...ns} />
        <line x1={Nbt[0]} y1={Nbt[1]} x2={Fbt[0]} y2={Fbt[1]} {...ns} />
        <line x1={Nb[0]} y1={Nb[1]} x2={Fb[0]} y2={Fb[1]} {...ns} />
      </g>
      {/* posts + crossbar, with a dark outline so they read on the turf */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline
          points={[F, Ft, Nt, N].map(pt).join(" ")}
          stroke="rgba(10,6,20,0.55)"
          strokeWidth={post + 2.4}
          {...ns}
        />
        <polyline
          points={[F, Ft, Nt, N].map(pt).join(" ")}
          stroke="#ffffff"
          strokeWidth={post}
          {...ns}
        />
      </g>
    </svg>
  );
}

function Figure({
  figRef,
  frameRefs,
  frames,
  src,
  initial,
  startFrame,
  flip = false,
  glow,
  className = "",
}) {
  return (
    <div
      ref={figRef}
      className={`absolute h-[21%] -translate-x-1/2 sm:h-[23%] ${className}`}
      style={{ ...initial, aspectRatio: "0.82" }}
    >
      <span className="absolute -bottom-[3%] left-1/2 h-[8%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-[3px]" />
      <div
        data-flip
        className="absolute inset-0"
        style={{ transform: flip ? "scaleX(-1)" : "none" }}
      >
        {frames.map((f) => (
          <img
            key={f}
            ref={(el) => (frameRefs.current[f] = el)}
            src={src(f)}
            alt=""
            draggable={false}
            className={`absolute bottom-0 left-1/2 w-auto max-w-none -translate-x-1/2 ${glow}`}
            style={{ height: poseHeight(f), opacity: f === startFrame ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}

function Pitch() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const playerRef = useRef(null);
  const frameRefs = useRef({});
  const oppRefs = [useRef(null), useRef(null)];
  const oppFrameRefs = [useRef({}), useRef({})];
  const ballRef = useRef(null);
  const trailRef = useRef(null);
  const goalRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    let raf;
    const t0 = performance.now();

    const show = (refs, frame) =>
      Object.entries(refs).forEach(([f, el]) => {
        if (el) el.style.opacity = f === frame ? "1" : "0";
      });

    const tick = (now) => {
      const t = (now - t0) % T.loop;

      // --- our player: runs right, swerving round each defender ---
      const runP = clamp01((t - T.runStart) / (T.runEnd - T.runStart));
      const x = X.start + (X.end - X.start) * ease(runP);
      const y = laneY(x);
      const running = t > T.runStart && t < T.runEnd;
      const dodging = DEFENDERS.some((d) => Math.abs(x - d.x) < DODGE_W);

      let frame = "run1";
      if (running)
        frame =
          Math.floor(t / (dodging ? 115 : 150)) % 2 === 0 ? "run1" : "run2";
      else if (t >= T.runEnd && t < T.kick - 80) frame = "run3";
      else if (t >= T.kick - 80) frame = "shoot";
      show(frameRefs.current, frame);
      if (playerRef.current) {
        playerRef.current.style.left = `${x}%`;
        playerRef.current.style.bottom = `${100 - y}%`;
        playerRef.current.style.zIndex = String(Math.round(y * 10));
      }

      // --- defenders: jockey, lunge in for the tackle, then turn and chase ---
      DEFENDERS.forEach((d, i) => {
        const el = oppRefs[i].current;
        if (!el) return;
        const dx = x - d.x;
        let ox = d.x;
        let oy = d.y;
        let pose = "run2";
        let flip = true; // facing left, towards our player
        if (dx < -12) {
          ox += Math.sin(t / 260 + i) * 0.5; // jockeying
        } else if (dx < 2) {
          const p = clamp01((dx + 12) / 12);
          pose = p > 0.35 ? "run3" : "run2"; // stretched leg = tackle attempt
          ox -= 2.2 * ease(p);
          oy += Math.sign(d.dodge) * 2.5 * ease(p); // lunges towards the ball's line
        } else {
          const p = clamp01((dx - 2) / 14);
          pose = Math.floor(t / 170) % 2 === 0 ? "run1" : "run2";
          flip = false; // beaten: turns and chases
          ox = d.x - 2.2 + 4 * p;
          oy = d.y + Math.sign(d.dodge) * 2.5 * (1 - p);
        }
        if (t >= T.kick) {
          // after the shot: stop where they are and stand, still facing the goal
          const p = clamp01((X.end - d.x - 2) / 14);
          ox = d.x - 2.2 + 4 * p;
          oy = d.y + Math.sign(d.dodge) * 2.5 * (1 - p);
          pose = "stand";
          flip = false;
        }
        if (t < T.runStart) {
          ox = d.x;
          oy = d.y;
          pose = "stand";
          flip = true;
        }
        el.style.left = `${ox}%`;
        el.style.bottom = `${100 - oy}%`;
        el.style.zIndex = String(Math.round(oy * 10));
        const flipEl = el.querySelector("[data-flip]");
        if (flipEl) flipEl.style.transform = flip ? "scaleX(-1)" : "none";
        show(oppFrameRefs[i].current, pose);
      });

      // --- ball: close control with little touches, then struck into the net ---
      const touch = running ? 1 + Math.sin(t / 170) * 0.9 : 0;
      let bx = x + 1.9 + touch * 0.7;
      let byLane = laneY(bx - 1);
      let lift = 0;
      let rot = x * 28;
      if (t >= T.kick) {
        const k = clamp01((t - T.kick) / (T.ballIn - T.kick));
        bx = X.end + 2.4 + (X.goal - X.end - 2.4) * k;
        byLane = FEET;
        lift = -Math.sin(Math.PI * k) * 170 - k * 70;
        rot = X.end * 28 + k * 720;
      }
      if (ballRef.current) {
        ballRef.current.style.left = `${bx}%`;
        ballRef.current.style.bottom = `${100 - byLane}%`;
        ballRef.current.style.zIndex = String(Math.round(byLane * 10) + 1);
        ballRef.current.style.transform = `translate(-50%, ${lift}%) rotate(${rot}deg)`;
        ballRef.current.style.opacity = t > T.goalEnd ? "0" : "1";
      }

      // --- trail, GOAL!, loop fade ---
      if (trailRef.current)
        trailRef.current.style.opacity = running
          ? String(0.35 + 0.65 * Math.sin(Math.PI * runP))
          : "0";
      if (goalRef.current) {
        const goalOn = t >= T.ballIn && t < T.goalEnd;
        const dribbleOn = running;
        const label = goalOn ? "Goal!" : dribbleOn ? "Dribble" : "";
        const on = goalOn || dribbleOn;
        const p = clamp01((t - T.ballIn) / 250);
        goalRef.current.textContent = label;
        goalRef.current.style.opacity = on ? "1" : "0";
        goalRef.current.style.transform = `translate(-50%, -50%) scale(${goalOn ? 0.7 + 0.35 * p : dribbleOn ? 1 : 0.7})`;
      }
      if (layerRef.current) {
        const fade =
          t > T.goalEnd
            ? 1 - clamp01((t - T.goalEnd) / (T.fadeEnd - T.goalEnd))
            : t < 250
              ? t / 250
              : 1;
        layerRef.current.style.opacity = String(fade);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  // Static scene (reduced motion / before the animation starts): skipping past the first defender
  const sx = reduce ? 37 : X.start;
  const sy = reduce ? laneY(37) : FEET;

  return (
    <div ref={ref} className="pitch-performance relative">
      <div className="relative">
        <div className="[perspective:1400px]">
          <div className="relative origin-bottom sm:[transform:rotateX(24deg)]">
            <div className="relative aspect-[2.3/1] overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,#1d7a3a_0%,#15602d_100%)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] sm:aspect-[2.6/1]">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 7.14%, rgba(0,0,0,0.04) 7.14% 14.28%)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_120%,transparent,rgba(42,11,74,0.55))]"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 400"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <g fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="3">
                  <rect x="20" y="20" width="960" height="360" />
                  <line x1="500" y1="20" x2="500" y2="380" />
                  <circle cx="500" cy="200" r="60" />
                  <rect x="20" y="110" width="110" height="180" />
                  <rect x="870" y="110" width="110" height="180" />
                  <rect x="20" y="160" width="40" height="80" />
                  <rect x="940" y="160" width="40" height="80" />
                </g>
                <g
                  stroke="rgba(255,62,165,0.55)"
                  strokeWidth="2"
                  strokeDasharray="8 10"
                >
                  <line x1="333" y1="20" x2="333" y2="380" />
                  <line x1="667" y1="20" x2="667" y2="380" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Goal: desktop/tablet (tilted pitch) and mobile (flat pitch) geometry */}
        <GoalFrame
          gx={95.2}
          yMid={54}
          mouth={13}
          height={17}
          depth={3.4}
          className="hidden sm:block"
        />
        <GoalFrame
          gx={95.4}
          yMid={51}
          mouth={16}
          height={24}
          depth={3.2}
          post={2}
          className="sm:hidden"
        />

        {/* Animated layer: our player, two defenders, ball and GOAL! */}
        <div
          ref={layerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {DEFENDERS.map((d, i) => (
            <Figure
              key={i}
              figRef={oppRefs[i]}
              frameRefs={oppFrameRefs[i]}
              frames={OPP_FRAMES}
              src={oppSrc}
              flip
              glow="drop-shadow-[0_0_10px_rgba(79,227,255,0.45)]"
              initial={{
                left: `${d.x}%`,
                bottom: `${100 - d.y}%`,
                zIndex: Math.round(d.y * 10),
              }}
              startFrame={reduce && i === 0 ? "run3" : "stand"}
            />
          ))}
          <div
            ref={playerRef}
            className="absolute h-[21%] -translate-x-1/2 sm:h-[23%]"
            style={{
              left: `${sx}%`,
              bottom: `${100 - sy}%`,
              zIndex: Math.round(sy * 10),
              aspectRatio: "0.82",
            }}
          >
            <span
              ref={trailRef}
              className="absolute right-[60%] top-[45%] h-[10%] w-[180%] rounded-full bg-gradient-to-l from-pink-electric/80 via-violet-glow/40 to-transparent opacity-0 blur-[3px]"
            />
            <span className="absolute -bottom-[3%] left-1/2 h-[8%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-[3px]" />
            {FRAMES.map((f) => (
              <img
                key={f}
                ref={(el) => (frameRefs.current[f] = el)}
                src={playerSrc(f)}
                alt=""
                draggable={false}
                className="absolute bottom-0 left-1/2 w-auto max-w-none -translate-x-1/2 drop-shadow-[0_0_12px_rgba(255,62,165,0.55)]"
                style={{
                  height: poseHeight(f),
                  opacity: f === (reduce ? "run2" : "run1") ? 1 : 0,
                }}
              />
            ))}
          </div>
          <div
            ref={ballRef}
            className="absolute aspect-square w-[1.6%]"
            style={{
              left: `${sx + 2}%`,
              bottom: `${100 - sy}%`,
              zIndex: Math.round(sy * 10) + 1,
              transform: "translate(-50%, 0)",
            }}
          >
            <BallIcon />
          </div>
          <div
            ref={goalRef}
            className="absolute left-[76%] top-[16%] z-[2000] font-display text-3xl font-extrabold uppercase italic text-white opacity-0 drop-shadow-[0_0_20px_rgba(255,62,165,1)] sm:left-[86%] sm:top-[14%] sm:text-6xl"
          >
            Goal!
          </div>
        </div>
      </div>

      <div className="pitch-zones mt-6 grid grid-cols-3 items-center text-center">
        {ZONES.map((z, i) => (
          <div
            key={z}
            className="relative flex items-center justify-center gap-2"
          >
            <span className="pitch-zone-label headline text-2xl text-white sm:text-4xl">
              {z}
            </span>
            {i < ZONES.length - 1 && (
              <MoveRight
                className="absolute -right-3 hidden text-pink-electric sm:block"
                size={28}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const JOURNEY = [
  { icon: Upload, label: "Submit activity" },
  { icon: Zap, label: "Earn Dribbles" },
  { icon: Footprints, label: "Move up the field" },
  { icon: Flag, label: "Score Goals" },
];

export default function GameExperience() {
  return (
    <section id="game" className="section game-experience-section !pb-2">
      <div
        aria-hidden="true"
        className="floodlight -right-40 top-20 bg-violet-glow"
      />
      <div className="container-x">
        <div className="game-intro mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">The Game Experience</p>
          <h2 className="game-heading headline mt-4 text-[clamp(2.6rem,6vw,4.8rem)]">
            Turn Field Activities Into{" "}
            <span className="text-gradient pr-2">Game Progress.</span>
          </h2>
          <p className="game-description mx-auto mt-5 max-w-xl text-lg text-white/70">
            Every activity keeps the game moving. Watch your performance come
            alive on the football field.
          </p>
        </div>
        <div className="game-cards mt-14 grid gap-5 md:grid-cols-2">
          {[
            {
              icon: Zap,
              name: "Dribbles",
              line: "Every activity creates momentum.",
              text: "Field activities earn Dribbles that push players forward across the pitch.",
              accent: "from-violet-glow/40",
            },
            {
              icon: Goal,
              name: "Goals",
              line: "Celebrate milestones and achievements.",
              text: "Goals mark the big moments, for the player and for the whole team.",
              accent: "from-pink-electric/40",
            },
          ].map((c, i) => (
            <motion.article
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="game-card glass group relative overflow-hidden p-8 sm:p-10"
            >
              <div
                aria-hidden="true"
                className={`absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${c.accent} to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-80`}
              />
              <div className="game-card-content relative flex items-start gap-5">
                <span className="game-card-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
                  <c.icon size={26} />
                </span>
                <div>
                  <h3 className="game-card-title headline text-4xl sm:text-5xl">
                    {c.name}
                  </h3>
                  <p className="game-card-line mt-2 font-display text-xl font-semibold uppercase tracking-wide text-pink-electric">
                    {c.line}
                  </p>
                  <p className="game-card-copy mt-3 text-white/70">{c.text}</p>
                  <p className="game-card-mobile-copy hidden">
                    {i === 0
                      ? "Log field activities like calls, visits, and demos."
                      : "Achieve targets, complete challenges, and earn points."}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="game-performance-visual mt-16 sm:mt-20"
        >
          <Pitch />
        </motion.div>
        <div
          className="mobile-performance-stats hidden"
          aria-label="Live field performance statistics"
        >
          {" "}
          {[
            { icon: Footprints, value: "32", label: "Activities" },
            { icon: Goal, value: "08", label: "Challenges" },
            { icon: Flag, value: "14", label: "Completed" },
            { icon: Trophy, value: "10", label: "Rewards" },
          ].map((s) => (
            <div key={s.label} className="mobile-performance-stat glass">
              {" "}
              <s.icon aria-hidden="true" /> <strong>{s.value}</strong>{" "}
              <span>{s.label}</span>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        <p className="mobile-performance-caption hidden">
          Live Field Performance
        </p>{" "}
        <ol className="game-journey mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {JOURNEY.map((s, i) => (
            <li
              key={s.label}
              className="glass flex flex-col items-center gap-3 !rounded-2xl px-4 py-5 text-center"
            >
              <span className="font-display text-sm font-bold tracking-widest text-white/40">
                0{i + 1}
              </span>
              <s.icon
                size={24}
                className="text-pink-electric"
                aria-hidden="true"
              />
              <span className="font-display text-lg font-bold uppercase tracking-wide">
                {s.label}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center font-display text-xl font-semibold uppercase tracking-wider text-white/60">
          Earn Dribbles. Score Goals. Lead your team.
        </p>
      </div>
    </section>
  );
}
