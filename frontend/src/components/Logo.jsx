import { ASSETS } from '../data/content';

// The official Sales Soccer logo, unaltered. It is a purple mark on a transparent
// background, so it is always presented on a light badge for contrast on dark pages.
// `plain` renders the logo with no badge, for use on white surfaces such as the header.
export default function Logo({ className = '', imgClassName = 'h-9 sm:h-10', plain = false, imgProps = {} }) {
  return (
    <span
      className={
        plain
          ? `inline-flex items-center ${className}`
          : `inline-flex items-center rounded-2xl bg-white px-3 py-1.5 shadow-[0_8px_30px_-10px_rgba(194,29,143,0.6)] ring-1 ring-white/60 ${className}`
      }
    >
      <img
        {...imgProps}
        src={ASSETS.logoTrimmed}
        alt="Sales Soccer"
        width="545"
        height="254"
        className={`w-auto object-contain ${imgClassName}`}
      />
    </span>
  );
}
