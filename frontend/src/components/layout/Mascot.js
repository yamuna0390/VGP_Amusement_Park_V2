"use client";

export default function Mascot() {
  const handleClick = () => {
    alert("👑 Kutti Raja: Welcome to my kingdom!");
  };

  return (
    <div
      className="mascot"
      onClick={handleClick}
      title="Chutti Sepoy reporting for duty!"
    >
      <img
        src="/assets/img_79f9c0375c2d.png"
        alt="Chutti Sepoy mascot"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
