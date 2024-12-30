'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface GSAPWrapperProps {
  children: ReactNode;
  animation?: gsap.TweenVars;
  scrollTrigger?: boolean;
  scrollConfig?: ScrollTrigger.Vars;
}

export function GSAPWrapper({
  children,
  animation = {
    opacity: 0,
    y: 50,
    duration: 1,
  },
  scrollTrigger = false,
  scrollConfig,
}: GSAPWrapperProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    // biome-ignore lint/style/useBlockStatements: <quick return statement>
    if (!element) return;

    const ctx = gsap.context(() => {
      if (scrollTrigger && scrollConfig) {
        gsap.from(element, {
          ...animation,
          scrollTrigger: {
            trigger: element,
            start: 'top center',
            end: 'bottom center',
            ...scrollConfig,
          },
        });
      } else {
        gsap.from(element, animation);
      }
    });

    return () => ctx.revert();
  }, [animation, scrollTrigger, scrollConfig]);

  return <div ref={elementRef}>{children}</div>;
}
