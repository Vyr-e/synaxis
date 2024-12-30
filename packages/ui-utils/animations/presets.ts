import type GSAPTweenVars from 'gsap';

// Basic Transitions
export const fadeInUp: GSAPTweenVars = {
  opacity: 0,
  y: 20,
  duration: 0.8,
  ease: 'power2.out',
};

export const fadeInDown: GSAPTweenVars = {
  opacity: 0,
  y: -20,
  duration: 0.8,
  ease: 'power2.out',
};

export const fadeInLeft: GSAPTweenVars = {
  opacity: 0,
  x: -20,
  duration: 0.8,
  ease: 'power2.out',
};

export const fadeInRight: GSAPTweenVars = {
  opacity: 0,
  x: 20,
  duration: 0.8,
  ease: 'power2.out',
};

// Section Reveals
export const revealSection: GSAPTweenVars = {
  opacity: 0,
  y: 0,
  duration: 1,
  ease: 'power1.inOut',
  stagger: {
    amount: 0.3,
    from: 'start',
  },
};

// Scroll-Based Variations
export const parallaxScroll: GSAPTweenVars = {
  y: 50,
  opacity: 1,
  duration: 1,
  ease: 'none',
};

export const scaleIn: GSAPTweenVars = {
  scale: 0.95,
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
};

// Text Animations
export const textReveal: GSAPTweenVars = {
  y: 100,
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
  stagger: {
    amount: 0.2,
  },
};

// Usage example:
// <GSAPWrapper animation={fadeInUp} scrollTrigger>
//   <YourContent />
// </GSAPWrapper>
