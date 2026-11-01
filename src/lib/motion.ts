// D110 / D147: each picture with class "gl-mo" plays once, when 35% of it scrolls into view (the script adds .is-on), then keeps its gentle idle.
// With reduced motion, or without IntersectionObserver, nothing is armed and every picture simply shows its finished pose.
export function armMotion(): void {
  const mo = Array.from(document.querySelectorAll<HTMLElement>('.gl-mo'));
  if (!mo.length || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    (en.target as HTMLElement).classList.add('is-on');
    io.unobserve(en.target);
  }), { threshold: 0.35 });
  mo.forEach((el) => { el.classList.add('is-armed'); io.observe(el); });
}
