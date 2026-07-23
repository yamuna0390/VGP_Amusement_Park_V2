export default function Polaroid({ image, caption, rotation = 0 }) {
  return (
    <div className="polaroid" style={{ transform: `rotate(${rotation}deg)` }}>
      <img src={image} alt={caption} />
      <div className="pol-cap">{caption}</div>
    </div>
  );
}
