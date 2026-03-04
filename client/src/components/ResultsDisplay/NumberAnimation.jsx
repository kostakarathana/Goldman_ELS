// visually counts up from 0 to the final value in the Estimated Future Value box

import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

export default function AnimatedNumber({ value, format, delay = 0 }) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(format(Math.round(v))),
    });
    return controls.stop;
  }, [value, delay]);

  return <span>{display}</span>;
}
