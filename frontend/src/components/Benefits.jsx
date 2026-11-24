import { motion } from 'framer-motion';
import { BENEFITS } from '../data/content';
import { ICONS } from '../lib/icons';

export default function Benefits() {
  return (
    <section id="benefits" className="section bg-[linear-gradient(180deg,#0a0614_0%,#120a22_50%,#05030a_100%)]">
      <div aria-hidden="true" className="absolute inset-0 turf-stripes opacity-50" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Built for Pharma Brand Managers</p>
          <h2 className="headline mt-4 text-[clamp(2.6rem,6vw,4.8rem)]">
            Bring More Energy to <span className="text-gradient pr-2">Every Brand Drive.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Built for Prescription, POB, Conversion, Camp and other activity-led campaigns.
          </p>
        </div>

        <div className="mt-8 grid gap-2 sm:mt-14 sm:gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon];
            return (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={`glass group relative overflow-hidden p-3 sm:p-5 lg:p-8 lg:col-span-2 ${i === 3 ? 'lg:col-start-2' : ''} ${
                  i === 4 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-electric/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span aria-hidden="true" className="absolute -bottom-6 -right-2 font-display text-[120px] font-extrabold italic leading-none text-white/[0.04]">
                  0{i + 1}
                </span>
                <span className="relative flex h-9 w-9 items-center justify-center rounded-xl sm:h-11 sm:w-11 lg:h-14 lg:w-14 lg:rounded-2xl bg-gradient-to-br from-violet-royal to-magenta shadow-glow-violet ring-1 ring-white/20">
                  <Icon size={18} className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] lg:h-[26px] lg:w-[26px]" /></span>
                <h3 className="relative mt-3 line-clamp-2 font-display text-[13px] font-bold uppercase leading-tight tracking-wide sm:mt-4 sm:text-xl lg:mt-6 lg:text-3xl">{b.title}</h3>
                <p className="relative mt-1 line-clamp-2 text-[10px] leading-snug text-white/70 sm:text-sm lg:mt-2 lg:text-lg">{b.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
