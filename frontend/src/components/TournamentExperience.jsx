import { motion } from 'framer-motion';
import { Shield, ChevronDown, Info } from 'lucide-react';
import { BRACKET } from '../data/content';
import { TrophyArt } from './Artwork';

const BADGE_COLORS = ['#8b3dff', '#e0249c', '#4fe3ff', '#ff8a3d', '#22c55e', '#facc15', '#ff3ea5', '#a78bfa'];
const allTeams = BRACKET.league.flat();
const colorFor = (team) => BADGE_COLORS[allTeams.indexOf(team) % BADGE_COLORS.length];

function Team({ name }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('');
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
        <Shield size={28} strokeWidth={1.5} style={{ color: colorFor(name), fill: `${colorFor(name)}33` }} />
        <span className="absolute font-display text-[10px] font-extrabold">{initials}</span>
      </span>
      <span className="truncate text-sm font-semibold text-white/90">{name}</span>
    </div>
  );
}

function MatchCard({ teams, highlight = false }) {
  return (
    <div
      className={`relative rounded-2xl border p-3 backdrop-blur-xl ${
        highlight
          ? 'border-pink-electric/60 bg-gradient-to-br from-magenta/25 to-violet-royal/30 shadow-glow'
          : 'border-white/10 bg-white/[0.05]'
      }`}
    >
      <Team name={teams[0]} />
      <div className="my-1.5 flex items-center gap-2 pl-1">
        <span className="h-px flex-1 bg-white/10" />
        <span className="font-display text-xs font-bold uppercase tracking-widest text-pink-electric">vs</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <Team name={teams[1]} />
    </div>
  );
}

function GroupCard({ teams, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/50">{label}</p>
      <div className="space-y-2">
        {teams.map((t) => (
          <Team key={t} name={t} />
        ))}
      </div>
    </div>
  );
}

// Bracket connector: joins the vertical centres of two stacked children and
// draws a line out towards the next round.
function Pair({ children }) {
  return (
    <div className="relative flex h-full flex-col justify-around">
      {children}
      <span aria-hidden="true" className="absolute -right-6 bottom-1/4 top-1/4 w-6 rounded-r-xl border-y border-r border-pink-electric/50" />
      <span aria-hidden="true" className="absolute -right-12 top-1/2 h-px w-6 bg-pink-electric/50" />
    </div>
  );
}

function Stub() {
  return <span aria-hidden="true" className="absolute -right-12 top-1/2 h-px w-12 bg-pink-electric/50" />;
}

const STAGES = ['League Matches', 'Quarterfinals', 'Semifinals', 'Finals'];

function DesktopBracket() {
  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_0.9fr] gap-12">
        {STAGES.map((s) => (
          <p key={s} className="text-center font-display text-lg font-bold uppercase tracking-[0.2em] text-white/70">
            {s}
          </p>
        ))}
        <p className="text-center font-display text-lg font-bold uppercase tracking-[0.2em] text-amber-200">Champions</p>
      </div>

      <div className="mt-6 grid h-[600px] grid-cols-[1fr_1fr_1fr_1fr_0.9fr] gap-12">
        {/* League */}
        <div className="flex flex-col justify-around">
          {BRACKET.league.map((g, i) => (
            <div key={i} className="relative">
              <GroupCard teams={g} label={`Group ${String.fromCharCode(65 + i)}`} />
              <Stub />
            </div>
          ))}
        </div>
        {/* QF */}
        <div className="flex flex-col">
          {[0, 2].map((i) => (
            <div key={i} className="h-1/2">
              <Pair>
                <MatchCard teams={BRACKET.quarterfinals[i]} />
                <MatchCard teams={BRACKET.quarterfinals[i + 1]} />
              </Pair>
            </div>
          ))}
        </div>
        {/* SF */}
        <Pair>
          <MatchCard teams={BRACKET.semifinals[0]} />
          <MatchCard teams={BRACKET.semifinals[1]} />
        </Pair>
        {/* Final */}
        <div className="relative flex flex-col justify-center">
          <MatchCard teams={BRACKET.final} highlight />
          <Stub />
        </div>
        {/* Trophy */}
        <div className="flex items-center justify-center">
          <Trophy />
        </div>
      </div>
    </div>
  );
}

function Trophy({ small = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] border border-amber-200/30 bg-[radial-gradient(120%_90%_at_50%_30%,#4b1381_0%,#1b0f33_55%,#0a0614_100%)] shadow-[0_0_80px_-20px_rgba(251,191,36,0.6)] ${
        small ? 'mx-auto h-80 w-60' : 'h-[420px] w-full'
      }`}
    >
      <TrophyArt className={small ? 'h-56 w-auto' : 'h-72 w-auto'} />
      <p className="headline mt-2 text-center text-2xl text-amber-100">Lift the trophy</p>
    </motion.div>
  );
}

function MobileBracket() {
  const stages = [
    {
      title: 'League Matches',
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {BRACKET.league.map((g, i) => (
            <GroupCard key={i} teams={g} label={`Group ${String.fromCharCode(65 + i)}`} />
          ))}
        </div>
      ),
    },
    {
      title: 'Quarterfinals',
      body: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BRACKET.quarterfinals.map((m, i) => (
            <MatchCard key={i} teams={m} />
          ))}
        </div>
      ),
    },
    {
      title: 'Semifinals',
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {BRACKET.semifinals.map((m, i) => (
            <MatchCard key={i} teams={m} />
          ))}
        </div>
      ),
    },
    { title: 'Finals', body: <MatchCard teams={BRACKET.final} highlight /> },
  ];
  return (
    <ol className="space-y-2 lg:hidden">
      {stages.map((s, i) => (
        <motion.li
          key={s.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass p-5">
            <p className="mb-4 flex items-center gap-3 font-display text-lg font-bold uppercase tracking-[0.2em]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-sm">{i + 1}</span>
              {s.title}
            </p>
            {s.body}
          </div>
          <div className="flex justify-center py-1 text-pink-electric" aria-hidden="true">
            <ChevronDown size={26} />
          </div>
        </motion.li>
      ))}
      <li>
        <Trophy small />
      </li>
    </ol>
  );
}

export default function TournamentExperience() {
  return (
    <section id="tournament" className="section bg-[linear-gradient(180deg,#05030a_0%,#120a22_40%,#0a0614_100%)]">
      <div aria-hidden="true" className="absolute inset-0 turf-stripes opacity-60" />
      <div aria-hidden="true" className="floodlight -left-40 bottom-0 bg-magenta" />
      <div className="container-x relative">
        <div className="max-w-3xl">
          <p className="eyebrow">The Tournament Experience</p>
          <h2 className="headline mt-4 text-[clamp(2.6rem,6vw,4.8rem)]">
            Every Brand Drive. <span className="text-gradient pr-2">A New Tournament.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Run brand campaigns as organised competitions. Teams from different territories and regions go head to head,
            round after round, from the league stage all the way to the final.
          </p>
        </div>

        <div className="mt-14">
          <DesktopBracket />
          <MobileBracket />
        </div>

        <p className="mt-8 flex items-start gap-2 text-sm text-white/45">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Illustrative tournament. Team names are examples only and do not represent client campaigns or results.
        </p>
      </div>
    </section>
  );
}
