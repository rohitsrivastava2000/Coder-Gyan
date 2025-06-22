import { useEffect, useState } from "react";

const Slider = ({ Images = [], width = 800 }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % Images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [Images.length]);

  return (
    <div
      style={{
        overflow: "hidden",
        width: `${width}px`,
        
        borderRadius: "12px",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${current * width}px)`,
        }}
      >
        {Images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            style={{
              width: `${width}px`,
              
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
