export default function Pill({ label, active, onClick }) {
  return (
    <button className={`pill ${active ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}
