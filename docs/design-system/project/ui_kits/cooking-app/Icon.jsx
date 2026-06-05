/* Icon — wraps Lucide, rendered imperatively so React never diffs the swapped SVG. */
function Icon({ name, size = 24, color, style, strokeWidth = 2 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({
      attrs: { width: size, height: size, 'stroke-width': strokeWidth },
    });
  }, [name, size, strokeWidth]);
  return (
    <span
      ref={ref}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, color, ...style }}
    ></span>
  );
}

/* Status badge used across pantry + recipes */
function Badge({ kind, children }) {
  const map = {
    category: 'tag--category', soon: 'tag--soon', expired: 'tag--expired',
    have: 'tag--have', missing: 'tag--missing', plain: '',
  };
  return <span className={'tag ' + (map[kind] || '')}>{children}</span>;
}

window.Icon = Icon;
window.Badge = Badge;
