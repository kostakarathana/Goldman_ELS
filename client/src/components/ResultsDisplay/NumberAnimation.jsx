import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export default function AnimatedNumber({ value, format, delay = 0 }) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    const controls = animate(0, safeValue, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(format(Math.round(v))),
      onComplete: () => setDisplay(format(safeValue)),
    });

    return () => controls.stop();
  }, [safeValue, delay, format]);

  return <span>{display}</span>;
}
