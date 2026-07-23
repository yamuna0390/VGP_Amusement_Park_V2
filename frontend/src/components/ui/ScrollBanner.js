export default function ScrollBanner({ title, subtitle, colorClass = "sb-c0" }) {
  return (
    <div className={`scroll-banner ${colorClass}`}>
      <h2 className="sb-t">{title}</h2>
      {subtitle && <p className="sb-s">{subtitle}</p>}
    </div>
  );
}
