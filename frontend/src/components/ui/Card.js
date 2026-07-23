export default function Card({ title, subtitle, badge, image, children }) {
  return (
    <div className="card">
      {badge && <span className="card-badge">{badge}</span>}
      {image && <div className="card-img" style={{ backgroundImage: `url(${image})` }}></div>}
      <div className="card-body">
        {title && <h3>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
