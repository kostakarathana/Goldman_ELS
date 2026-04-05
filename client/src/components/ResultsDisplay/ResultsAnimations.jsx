export const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export const springPop = { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] };
export const smoothIn = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
